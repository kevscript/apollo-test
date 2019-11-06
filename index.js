require('dotenv').config()
const { ApolloServer, gql } = require('apollo-server')
const mongoose = require('mongoose')

// schemas
const Dog = require('./models/dog')

const typeDefs = gql`
  type Dog {
    _id: String!
    name: String!
    age: Int!
  }
  type Mutation {
    addDog(name: String!, age: Int!): Dog
    deleteDog(id: String!): Dog
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
      await Dog.findOne({ name: name }, async (err, res) => {
        if (err) {
          return new Error("An error occured")
        }
        if (res) {
          return new Error(`A dog named ${name} already exists`)
        } else {
          const newDog = new Dog({ name, age })
          await newDog.save()
        }
      })
    },
    deleteDog: async (_, {id}) => {
      await Dog.findOne({ _id: id }, async (err, res) => {
        if (err) {
          return new Error("An error occured")
        }
        if (res) {
          await Dog.deleteOne(res)
        } else {
          return new Error("No dog found with this id")
        }
      })
    }
  }
}

const server = new ApolloServer({ typeDefs, resolvers })

const port = 4000

mongoose
  .connect(process.env.MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => server.listen({ port }))
  .then(() => console.log(`server running on port ${port}`))
