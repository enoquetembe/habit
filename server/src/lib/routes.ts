import { FastifyInstance } from "fastify"
import {prisma} from './prisma'
import { z } from "zod"
import dayjs from "dayjs"
import { User } from "@prisma/client"

export async function appRoutes(app: FastifyInstance) {
  app.post("/signup", async (request) => {
    const createHabitBody = z.object({
      username: z.string().min(4).max(30),
      password: z.string().min(8).max(30),
    })
    
    const { username, password } = createHabitBody.parse(request.body)

    const userExists = await prisma.user.findUnique({
      where: {
        username,
      },
    })

    if (userExists) {
      throw new Error("This user already exists")
    }

    const { id } = await prisma.user.create({
      data: {
        username,
        hash: await app.bcrypt.hash(password),
      },
    })

    const token = app.jwt.sign({ id, username })

    return {
      token,
    }
  })

  app.post("/signin", async (request) => {
    const createHabitBody = z.object({
      username: z.string().min(3).max(30),
      password: z.string().min(6).max(30),
    })

    const { username, password } = createHabitBody.parse(request.body)

    const userExists = await prisma.user.findFirst({
      where: {
        username,
      },
    })

    if (!userExists) {
      throw new Error("User not found")
    }

    const isValid = await app.bcrypt.compare(password, userExists.hash)

    if (!isValid) {
      throw new Error("Invalid username or password")
    }

    const token = app.jwt.sign({ id: userExists.id, username })

    return {
      token,
    }
  })

  app.post("/habits", async (request) => {
    const createHabitBody = z.object({
      title: z.string(),
      weekDays: z.array(z.number().min(0).max(6)),
    })

    const { title, weekDays } = createHabitBody.parse(request.body)

    const today = dayjs().startOf("day").toDate()

    await prisma.habit.create({
      data: {
        title,
        weekDays: {
          create: weekDays.map((day) => ({
            week_day: day,
          })),
        },
        created_at: today,
        user_id: (request.user as User).id,
      },
    })

    // await prisma.day.create({
    //   data: {
    //     date: today,
    //     user_id: (request.user as User).id
    //   }
    // })
  })

  app.get("/day", async (request) => {
    const getDayParams = z.object({
      date: z.coerce.date(),
    })

    const { date } = getDayParams.parse(request.query)

    const parsedDate = dayjs(date).startOf("day")
    const weekDay = dayjs(parsedDate).get("day")

    const possibleHabits = await prisma.habit.findMany({
      where: {
        created_at: {
          lte: date,
        },
        weekDays: {
          some: {
            week_day: weekDay,
          },
        },
        user_id: (request.user as User).id,
      },
    })

    const day = await prisma.day.findUnique({
      where: {
        date_user_id: {
          date: parsedDate.toDate(),
          user_id: (request.user as User).id,
        },
      },
      include: {
        dayHabits: true,
      },
    })

    const completedHabits = day?.dayHabits.map((dayHabit) => dayHabit.habit_id) ?? []

    return { possibleHabits, completedHabits }
  })

  app.patch("/habits/:id/toggle", async (request) => {
    const toggleHabitParams = z.object({
      id: z.string().uuid(),
    })

    const { id } = toggleHabitParams.parse(request.params)

    const today = dayjs().startOf("day").toDate()

    // check if the habit is of the user
    const userHabit = await prisma.habit.findFirst({
      where: {
        id,
        user_id: (request.user as User).id,
      },
    })

    if (!userHabit) {
      throw new Error("You dont have access to this habit")
    }

    let day = await prisma.day.findFirst({
      where: {
        date: today,
        user_id: (request.user as User).id,
      },
    })

    if (!day) {
      day = await prisma.day.create({
        data: {
          date: today,
          user_id: (request.user as User).id,
        },
      })
    }

    const dayHabit = await prisma.dayHabit.findUnique({
      where: {
        day_id_habit_id: {
          day_id: day.id,
          habit_id: id,
        },
      },
    })

    if (dayHabit) {
      await prisma.dayHabit.delete({
        where: {
          id: dayHabit.id,
        },
      })
    } else {
      await prisma.dayHabit.create({
        data: {
          day_id: day.id,
          habit_id: id,
        },
      })
    }
  })

  app.get("/summary", async (request) => {
    const summary = await prisma.$queryRaw`
      SELECT
        d.id,
        d.date,
        (
          SELECT cast(count(*) as float)
            FROM day_habits dayhabit
           WHERE dayhabit.day_id = d.id 
        ) as completed,
        (
          SELECT cast(count(*) as float)
            FROM habit_week_days hwd
            JOIN habits h
              ON h.id = hwd.habit_id
           WHERE hwd.week_day =  cast(strftime('%W', d.date/1000.0, 'unixepoch') as int)
             AND h.created_at <= d.date
        ) as amount
      FROM
        days d
      WHERE
          d.user_id = ${(request.user as User).id}
    `
    return summary
  })
}
