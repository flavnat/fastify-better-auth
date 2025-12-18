import Fastify from 'fastify';
import { env } from './config/env.js';
import { envToLogger } from './config/logger.js';
import dbPlugin from './plugins/db.js';
import { users } from './db/schema.js';
import z from 'zod';

const fastify = Fastify({
  logger: envToLogger["development"] ?? true
});


const userSchema = z.object({
  username: z.string(),
  email: z.string()
})

type createUser = z.infer<typeof userSchema>

async function start() {
  try {
    await fastify.register(dbPlugin);
    fastify.get('/', async (request, reply) => {
      const allUsers = await fastify.db.select().from(users);
      return allUsers;
    });


    fastify.post('/', async (request, reply) => {
      const { username, email } = userSchema.parse(request.body)
      await fastify.db.insert(users).values({
        username,
        email
      });
    })

    await fastify.listen({ port: Number(env.PORT) || 3000 });

  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();