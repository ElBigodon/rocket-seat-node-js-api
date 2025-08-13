import fastify from 'fastify'
import { jsonSchemaTransform, serializerCompiler, validatorCompiler, type ZodTypeProvider } from 'fastify-type-provider-zod'
import fastifySwagger from '@fastify/swagger'
import { getCourseByIdRoute } from './src/routes/get-course-by-id.ts'
import { getCoursesRoute } from './src/routes/get-courses.ts'
import { postCourseRoute } from './src/routes/post-course.ts'

const server = fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
}).withTypeProvider<ZodTypeProvider>()

server.setSerializerCompiler(serializerCompiler)
server.setValidatorCompiler(validatorCompiler)

if (process.env.NODE_ENV === 'development') {
  server.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Rocketseat NodeJS API',
        version: '1.0.0',
      },
    },
    transform: jsonSchemaTransform,
  })

  server.register(import('@scalar/fastify-api-reference'), {
    routePrefix: '/docs',
  })
}

server.register(getCourseByIdRoute)
server.register(getCoursesRoute)
server.register(postCourseRoute)

server.listen({ port: 3000 }).then(() => console.log('Server running on port 3000'))
