import {server} from './server'
import {app} from './express/app'

async function startApolloServer() {
  await server.start()
  server.applyMiddleware({app})
  await new Promise<void>(resolve => {
    app.listen({port: 4000}, resolve)
  })
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
}

startApolloServer()
