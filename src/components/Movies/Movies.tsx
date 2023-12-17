import React, { Component } from 'react'
import { Tabs } from 'antd'

import MovieContext from '../../services/movie-service-context'
import { MovieContextType, NamesType } from '../../models'
import MoviesList from '../MoviesList/MoviesList'
import MovieSearch from '../MovieSearch/MovieSearch'
import { ALL_TABS } from '../../utils/constants'
import { setLsGuestId } from '../../utils/helpers'
import './Movies.scss'

type State = {
  currTab: string

  isLoading: boolean
  hasError: boolean
}

class Movies extends Component<object, State> {
  // eslint-disable-next-line react/static-property-placement
  context: MovieContextType

  constructor(props: object) {
    super(props)
    this.state = {
      currTab: 'Search',

      isLoading: true,
      hasError: false,
    }
  }

  componentDidMount() {
    const { createGuestSession, getGenres } = this.context
    setLsGuestId(createGuestSession, this.onError)
    getGenres().catch(this.onError)

    this.onSetMovies()
  }

  setMovies = async (cb: () => Promise<void>) => {
    this.setState({ isLoading: true })

    cb()
      .then(() => this.setState({ isLoading: false }))
      .catch(this.onError)
  }

  onSetMovies = (page = 1) => {
    const { currTab } = this.state
    const { getMovies, getRatedMovies, ratedMovies, allMovies, isChanged } = this.context
    const [isSearchUpd, isRatedUpd] = isChanged

    const names = currTab === 'Search' ? [getMovies, allMovies, isSearchUpd] : [getRatedMovies, ratedMovies, isRatedUpd]
    const [fn, data, hasChanges] = names as NamesType

    if (data.movies.length === 0 || page !== data.page || (hasChanges as boolean)) {
      this.setMovies(() => fn(page))
    }
  }

  onChange = (page: number) => {
    this.onSetMovies(page)
  }

  onSearch = (query: string) => {
    const { searchMovies } = this.context
    this.setMovies(() => searchMovies(query))
  }

  onError = () => {
    this.setState({ hasError: true, isLoading: false })
  }

  onChangeTab = (currTab: string) => {
    const { allMovies } = this.context
    const page = currTab === 'Search' ? allMovies.page : 1

    this.setState({ currTab }, () => this.onSetMovies(page))
  }

  render() {
    const { currTab } = this.state

    const items = ALL_TABS.map((name) => {
      const { hasError, isLoading } = this.state
      const { ratedMovies, allMovies } = this.context
      const isSearchTab = name === 'Search'
      const moviesData = isSearchTab ? allMovies : ratedMovies

      return {
        key: name,
        label: name,
        children: (
          <>
            {isSearchTab && <MovieSearch onSearch={this.onSearch} />}
            <MoviesList moviesData={moviesData} isLoading={isLoading} hasError={hasError} onChange={this.onChange} />
          </>
        ),
      }
    })

    return <Tabs className="tabs" defaultActiveKey={currTab} items={items} onChange={this.onChangeTab} centered />
  }
}

Movies.contextType = MovieContext

export default Movies
