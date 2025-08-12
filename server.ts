import fastify from 'fastify'
import crypto from 'node:crypto'

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
})

const users = [
  {
    id: crypto.randomUUID(),
    name: Math.random().toString().slice(2),
    age: Math.ceil(Math.random() * 50)
  },
  {
    id: crypto.randomUUID(),
    name: Math.random().toString().slice(2),
    age: Math.ceil(Math.random() * 50)
  },
  {
    id: crypto.randomUUID(),
    name: Math.random().toString().slice(2),
    age: Math.ceil(Math.random() * 50)
  }
]

server.get('/users', () => {
  return users
})

interface Params {
  id: string
}

server.get('/users/:id', (req, res) => {
  const params = req.params as Params
  
  if ('id' in params === false) {
    res.status(400)
    
    return {
      result: 'user id is required'
    }
  }
  
  const user = users.find(({ id }) => id === params.id)
  
  if (!user) {
    res.status(404);
    
    return { result: 'not found' }
  }

  return { result: user }
})

interface Body {
  name: string
  age: number
}

server.post('/users', (req, res) => {
  const body = req.body as Body
  
  if (!body || typeof body !== 'object') {
    res.status(400);
    
    return { result: 'bad request' }
  }

  if ('name' in body === false || 'age' in body === false) {
    res.status(400)
    
    return { result: 'bad request' }
  }
   
  const newId = crypto.randomUUID()

  const len = users.push({ id: newId, ...body })
  
  return {
    result: users[len - 1].id
  }
})

server.listen({ port: 3000 }).then(() => console.log('Server running on port 3000'))
