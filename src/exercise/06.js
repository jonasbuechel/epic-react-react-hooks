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
  const [state, setState] = useState({
    status: 'idle',
    pokemon: null,
    error: null,
  })

  const {status, pokemon, error} = state

  useEffect(() => {
    if (!pokemonName) {
      return
    }

    setState({pokemon: null, status: 'pending', error: null})

    fetchPokemon(pokemonName, 1500)
      .then(
        pokemonData => {
          setState({pokemon: pokemonData, status: 'resolved', error: null})
        },
        error => {
          setState({pokemon: null, status: 'rejected', error})
        },
      )
      .catch(error => {
        setState({
          pokemon: null,
          status: 'error',
          error,
        })
      })
  }, [pokemonName])

  if (status === 'rejected' || status === 'error') {
    throw error
  } else if (status === 'idle') {
    return 'Submit a pokemon'
  } else if (status === 'pending') {
    return <PokemonInfoFallback name={pokemonName} />
  } else if (status === 'resolved') {
    return <PokemonDataView pokemon={pokemon} />
  }
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {hasError: false, errorMessage: ''}
  }

  static getDerivedStateFromError(error) {
    return {hasError: true}
  }

  componentDidCatch(error, errorInfo) {
    this.setState({errorMessage: error.message})
  }

  render() {
    if (this.state.hasError) {
      return (
        <this.props.fallbackComponent errorMessage={this.state.errorMessage} />
      )
    }

    return this.props.children
  }
}

function ErrorFallbackComponent({errorMessage}) {
  return (
    <div role="alert">
      There was an error:
      <pre style={{whiteSpace: 'normal'}}>{errorMessage}</pre>
    </div>
  )
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
        <ErrorBoundary
          key={pokemonName}
          fallbackComponent={ErrorFallbackComponent}
        >
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
