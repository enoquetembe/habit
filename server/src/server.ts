import Fastify from 'fastify'
import { PrismaClient } from '@prisma/client'
import cors from '@fastify/cors'

const app = Fastify()
app.register(cors)

const prisma = new PrismaClient()

app.get('/habit', async () => {
 const habits = await prisma.habit.findMany()

 return habits
})

app.listen({
  port: 3333
}).then(() => {
  console.log('Server is running on port 3333')
})
