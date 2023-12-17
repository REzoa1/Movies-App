import React, { Component } from 'react'

import NoNetwork from '../NoNetwork/NoNetwork'
import Movies from '../Movies/Movies'
import MovieContext from '../../services/movie-service-context'
import MovieService from '../../services/movie-service'

class App extends Component {
  movieService = new MovieService()

  render() {
    return (
      <NoNetwork>
        <MovieContext.Provider value={this.movieService}>
          <MovieContext.Consumer>{() => <Movies />}</MovieContext.Consumer>
        </MovieContext.Provider>
      </NoNetwork>
    )
  }
}

export default App
