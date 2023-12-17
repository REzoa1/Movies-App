import { Input } from 'antd'
import React, { ChangeEvent, Component } from 'react'
import { debounce } from 'lodash'

import MovieContext from '../../services/movie-service-context'
import { MovieContextType } from '../../models'

type Props = {
  onSearch: (query: string) => void
}

type State = {
  value: string
}

class MovieSearch extends Component<Props, State> {
  // eslint-disable-next-line react/static-property-placement
  context: MovieContextType

  sendQuery = debounce((value) => {
    const { query } = this.context
    if (value !== query) {
      const { onSearch } = this.props

      onSearch(value === '' ? 'return' : value)
    }
  }, 1000)

  constructor(props: Props) {
    super(props)
    this.state = { value: '' }
  }

  onChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ value: e.target.value })
    this.sendQuery(e.target.value)
  }

  render() {
    const { query } = this.context
    const { value } = this.state

    return <Input placeholder="Type to search..." size="large" defaultValue={value || query} onChange={this.onChange} />
  }
}

MovieSearch.contextType = MovieContext

export default MovieSearch
