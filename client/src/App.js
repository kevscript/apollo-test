import React, { useState } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'

const FETCH_DOGS_QUERY = gql`
  query GetDogs {
    getDogs {
      id
      name
      age
    }
  }
`

const ADD_DOG_MUTATION = gql`
  mutation AddDog($name: String!, $age: Int!) {
    addDog(name: $name, age: $age) {
      id
      name
      age
    }
  }
`

const DELETE_DOG_MUTATION = gql`
  mutation DeleteDog($name: String!) {
    deleteDog(name: $name) {
      id
      age
      name
    }
  }
`

const App = () => {
  const [name, setName] = useState('')
  const [age, setAge] = useState('')

  const { loading, error, data } = useQuery(FETCH_DOGS_QUERY)
  const [addDog] = useMutation(ADD_DOG_MUTATION, { 
      variables: { name, age: Number(age) },
      refetchQueries: [{ query: FETCH_DOGS_QUERY }]
    }
  )

  const [deleteDog] = useMutation(DELETE_DOG_MUTATION, {
    refetchQueries: [{ query: FETCH_DOGS_QUERY }]
  })

  let dogs = data ? data.getDogs : null

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (name && age > 0) {
      try {
        await addDog()
        setName('')
        setAge('')
      } catch(err) {
        console.log('there is an error', err)
      }
    }
  }

  const handleDelete = async (e) => {
    const name = e.target.getAttribute('data-name')
    try {
      await deleteDog({ variables: { name: name } })
    } catch(err) {
      console.log('error deleting', err)
    }
  }

  return (
    <div>
      HI FROM APP
      { dogs && dogs.map(dog => 
        <div key={dog.id} style={{display:'flex', alignItems:'center'}}>
          <h3>name: {dog.name} / age: {dog.age} / id: {dog.id}</h3>
          <button data-name={dog.name} onClick={e => handleDelete(e)}>X</button>
        </div>
      )}
      <form onSubmit={e => handleSubmit(e)}>
        <label htmlFor="name">Name</label>
        <input onChange={e => setName(e.target.value)} type="text" placeholder="name" name="name" value={name} />
        <label htmlFor="age">Age</label>
        <input onChange={e => setAge(e.target.value)} type="number" placeholder="age" name="age" value={age} />
        <button>Add Dog</button>
      </form>
    </div>
  )
}

export default App
