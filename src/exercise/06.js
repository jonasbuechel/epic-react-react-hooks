// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
// 🐨 you'll want the following additional things from '../pokemon':
// fetchPokemon: the function we call to get the pokemon info
// PokemonInfoFallback: the thing we show while we're loading the pokemon info
// PokemonDataView: the stuff we use to display the pokemon info
import {
  fetchPokemon,
  PokemonDataView,
  PokemonForm,
  PokemonInfoFallback,
} from '../pokemon'
import {useEffect, useState} from 'react'

function PokemonInfo({pokemonName}) {
  const [pokemon, setPokemon] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!pokemonName) {
      return
    }

    setPokemon(null)
    fetchPokemon(pokemonName, 500)
      .then(
        pokemonData => setPokemon(pokemonData), // promise fulfilled
        error => setError(error), // promise rejected, also gets caught by catch
      )
      .catch(error => setError('A general error happened'))
  }, [pokemonName])

  if (error) {
    return (
      <div role="alert">
        There was an error:{error.message}
        <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      </div>
    )
  } else if (!pokemonName) {
    return 'Submit a pokemon'
  } else if (!pokemon) {
    return <PokemonInfoFallback name={pokemonName} />
  } else {
    return <PokemonDataView pokemon={pokemon} />
  }
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonInfo pokemonName={pokemonName} />
      </div>
    </div>
  )
}

export default App
