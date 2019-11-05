import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

const App = () => {
  const { loading, error, data } = useQuery(FETCH_DOGS_QUERY)
  let dogs = data ? data.getDogs : null


  return (
    <div className="App">
      HI FROM APP
      { dogs && dogs.map(dog => <h1 key={dog.id}>{dog.name}</h1>) }
    </div>
  );
}

const FETCH_DOGS_QUERY = gql`
  {
    getDogs {
      id
      name
      age
    }
  }
`

export default App
