import { PrismaClient } from "@prisma/client";
import fastify from "fastify";
import { prisma } from './database/prisma'
import { z } from 'zod'
const app = fastify()


app.get('/users', async () => {
    const users = await prisma.user.findMany()

    return users
})

app.post('/users', async (req, reply) => {
    const createUserSchema = z.object({
        name: z.string().nonempty(),
        email: z.string().email()
    })
    const { name, email} = createUserSchema.parse(req.body)

    await prisma.user.create({
        data: {
            name,
            email
        }
    })

    return reply.status(201).send()
})

app.listen({ host:'0.0.0.0', port: process.env.PORT ? Number(process.env.PORT): 3333 }).then(() => {
    console.log('HTTP Server Running!')
})