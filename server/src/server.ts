declare module 'fastify' {
  interface FastifyInstance {
    config: {
      PORT: number
      JWT_SECRET_KEY: string
      FRONTEND_URL: string
    }
  }
}

import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import env from '@fastify/env'
import bcrypt from 'fastify-bcrypt'
import { appRoutes } from './lib/routes'
import { User } from '@prisma/client'

const schema = {
  type: "object",
  required: ["PORT", "JWT_SECRET_KEY", "FRONTEND_URL"],
  properties: {
    PORT: {
      type: "number",
      default: 3000,
    },
    JWT_SECRET_KEY: {
      type: "string",
      default: "e33a6e7a-2682-42a3-bf63-c55b4f9daaec",
    },
    FRONTEND_URL: {
      type: "string",
      default: "http://localhost:5173",
    },
  },
}

const options = {
  schema: schema
}

const app = Fastify()

app.register(env, options).then(() => {
  app.register(bcrypt, {
    saltWorkFactor: 12
  })

    app.register(cors, {
      origin: [app.config.FRONTEND_URL],
    })

  app.register(jwt, {
    secret: app.config.JWT_SECRET_KEY
  })

  app.addHook('preHandler', async (request, reply) => {
    try {
      // make this urls public
      if (!['/signup', '/signin'].includes(request.url)) {
        await request.jwtVerify<User>()
      }
    } catch (err) {
      reply.send(err)
    }
  })

  app.register(appRoutes)

  app
    .listen({
      host: '0.0.0.0',
      port: app.config.PORT
    })
    .then(() => {
      console.log(`app running in ${app.config.PORT}`)
    })
})
