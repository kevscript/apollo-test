const { ApolloServer, gql } = require('apollo-server')

const typeDefs = gql`
  type Query {
    hello: String!
  }
`

const resolvers = {
  Query: {
    hello: () => 'hello world!'
  }
}

const server = new ApolloServer({ typeDefs, resolvers })

const port = 4000

server.listen({ port })
  .then(() => console.log(`server running on port ${port}`))