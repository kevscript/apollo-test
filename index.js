require('dotenv').config()
const { ApolloServer, gql } = require('apollo-server')
const mongoose = require('mongoose')

const Dog = require('./models/dog')

const typeDefs = gql`
  type Dog {
    id: ID!
    name: String!
    age: Int!
  }
  type Mutation {
    addDog(name: String!, age: Int!): Dog!
  }

  type Query {
    getDogs: [Dog]
  }

`

const resolvers = {
  Query: {
    getDogs: async () => {
      try {
        const dogs = await Dog.find()
        return dogs
      } catch (err) {
        throw new Error(err)
      }
    }
  },
  Mutation: {
    addDog: async (_, {name, age}) => {
      const newDog = new Dog({
        name,
        age
      })

      const res = await newDog.save()
      return newDog
    }
  }
}

const server = new ApolloServer({ typeDefs, resolvers })

const port = 4000

mongoose
  .connect(process.env.MONGODB, { useNewUrlParser: true })
  .then(() => server.listen({ port }))
  .then(() => console.log(`server running on port ${port}`))
