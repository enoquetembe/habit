import Fastify from 'fastify'
import { PrismaClient } from '@prisma/client'

const app = Fastify()

const prisma = new PrismaClient()


app.get('/habit', () => {
 const habits = prisma.habit.findMany({
  where: {
    title: {
      startsWith: 'Codar'
    }
  }
 })

 return habits
})

app.listen({
  port: 3333
}).then(() => {
  console.log('Server is running on port 3333')
})
