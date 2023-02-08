"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRoutes = void 0;
const prisma_1 = require("./prisma");
const zod_1 = require("zod");
const dayjs_1 = __importDefault(require("dayjs"));
async function appRoutes(app) {
    app.post("/signup", async (request) => {
        const createHabitBody = zod_1.z.object({
            username: zod_1.z.string().min(4).max(30),
            password: zod_1.z.string().min(8).max(30),
        });
        const { username, password } = createHabitBody.parse(request.body);
        const userExists = await prisma_1.prisma.user.findUnique({
            where: {
                username,
            },
        });
        if (userExists) {
            throw new Error("This user already exists");
        }
        const { id } = await prisma_1.prisma.user.create({
            data: {
                username,
                hash: await app.bcrypt.hash(password),
            },
        });
        const token = app.jwt.sign({ id, username });
        return {
            token,
        };
    });
    app.post("/signin", async (request) => {
        const createHabitBody = zod_1.z.object({
            username: zod_1.z.string().min(3).max(30),
            password: zod_1.z.string().min(6).max(30),
        });
        const { username, password } = createHabitBody.parse(request.body);
        const userExists = await prisma_1.prisma.user.findFirst({
            where: {
                username,
            },
        });
        if (!userExists) {
            throw new Error("User not found");
        }
        const isValid = await app.bcrypt.compare(password, userExists.hash);
        if (!isValid) {
            throw new Error("Invalid username or password");
        }
        const token = app.jwt.sign({ id: userExists.id, username });
        return {
            token,
        };
    });
    app.post("/habits", async (request) => {
        const createHabitBody = zod_1.z.object({
            title: zod_1.z.string(),
            weekDays: zod_1.z.array(zod_1.z.number().min(0).max(6)),
        });
        const { title, weekDays } = createHabitBody.parse(request.body);
        const today = (0, dayjs_1.default)().startOf("day").toDate();
        await prisma_1.prisma.habit.create({
            data: {
                title,
                weekDays: {
                    create: weekDays.map((day) => ({
                        week_day: day,
                    })),
                },
                created_at: today,
                user_id: request.user.id,
            },
        });
        // await prisma.day.create({
        //   data: {
        //     date: today,
        //     user_id: (request.user as User).id
        //   }
        // })
    });
    app.get("/day", async (request) => {
        const getDayParams = zod_1.z.object({
            date: zod_1.z.coerce.date(),
        });
        const { date } = getDayParams.parse(request.query);
        const parsedDate = (0, dayjs_1.default)(date).startOf("day");
        const weekDay = (0, dayjs_1.default)(parsedDate).get("day");
        const possibleHabits = await prisma_1.prisma.habit.findMany({
            where: {
                created_at: {
                    lte: date,
                },
                weekDays: {
                    some: {
                        week_day: weekDay,
                    },
                },
                user_id: request.user.id,
            },
        });
        const day = await prisma_1.prisma.day.findUnique({
            where: {
                date_user_id: {
                    date: parsedDate.toDate(),
                    user_id: request.user.id,
                },
            },
            include: {
                dayHabits: true,
            },
        });
        const completedHabits = day?.dayHabits.map((dayHabit) => dayHabit.habit_id) ?? [];
        return { possibleHabits, completedHabits };
    });
    app.patch("/habits/:id/toggle", async (request) => {
        const toggleHabitParams = zod_1.z.object({
            id: zod_1.z.string().uuid(),
        });
        const { id } = toggleHabitParams.parse(request.params);
        const today = (0, dayjs_1.default)().startOf("day").toDate();
        // check if the habit is of the user
        const userHabit = await prisma_1.prisma.habit.findFirst({
            where: {
                id,
                user_id: request.user.id,
            },
        });
        if (!userHabit) {
            throw new Error("You dont have access to this habit");
        }
        let day = await prisma_1.prisma.day.findFirst({
            where: {
                date: today,
                user_id: request.user.id,
            },
        });
        if (!day) {
            day = await prisma_1.prisma.day.create({
                data: {
                    date: today,
                    user_id: request.user.id,
                },
            });
        }
        const dayHabit = await prisma_1.prisma.dayHabit.findUnique({
            where: {
                day_id_habit_id: {
                    day_id: day.id,
                    habit_id: id,
                },
            },
        });
        if (dayHabit) {
            await prisma_1.prisma.dayHabit.delete({
                where: {
                    id: dayHabit.id,
                },
            });
        }
        else {
            await prisma_1.prisma.dayHabit.create({
                data: {
                    day_id: day.id,
                    habit_id: id,
                },
            });
        }
    });
    app.get("/summary", async (request) => {
        const summary = await prisma_1.prisma.$queryRaw `
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
          d.user_id = ${request.user.id}
    `;
        return summary;
    });
}
exports.appRoutes = appRoutes;
