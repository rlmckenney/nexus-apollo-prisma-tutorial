import {ApolloServer} from 'apollo-server-express'
import {context} from './context'
import {schema} from './schema'

// This will help create multiple server instances for parallel integration tests
export function createApolloServer() {
  return new ApolloServer({schema, context})
}

export const server = createApolloServer()
