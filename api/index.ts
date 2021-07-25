import {server} from './server'

// move this to its own module to configure the non-api routes
import express from 'express'
const app = express()

async function startApolloServer() {
  await server.start()
  server.applyMiddleware({app})
  await new Promise<void>(resolve => {
    app.listen({port: 4000}, resolve)
  })
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
}

startApolloServer()
