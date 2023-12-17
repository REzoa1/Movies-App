/* eslint-disable react/static-property-placement */
import React, { Component } from 'react'
import { Card, Image, Rate, Skeleton, Space, Tag, Typography } from 'antd'

import { cn, getMovieDate, getMovieGenres, textSlice } from '../../utils/helpers'
import MovieContext from '../../services/movie-service-context'
import { LsDataType, MovieContextType } from '../../models'
import { fallback } from '../../utils/constants'
import './MovieItem.scss'

const { Text, Paragraph } = Typography

type Props = {
  id: number
  title: string
  genreIds: Array<number>
  overview: string
  posterPath: string
  realiseDate: string
  voteAverage: number
  rating?: number
}

type State = {
  rateVal: number
}

class MovieItem extends Component<Props, State> {
  static defaultProps = {
    rating: 0,
  }

  context: MovieContextType

  constructor(props: Props) {
    super(props)
    this.state = {
      rateVal: props.rating || 0,
    }
  }

  onChangeRate = (value: number) => {
    const { id } = this.props
    this.setState({ rateVal: value })

    const { setRate, deleteRate } = this.context
    const lsData = localStorage?.getItem('ratedMovies') ? JSON.parse(localStorage?.getItem('ratedMovies') || '') : []

    if (value === 0) {
      deleteRate(id)
    } else {
      setRate(id, value)
    }

    const newRatedMovie = { id, rating: value }
    const filteredMovies = lsData.filter((a: LsDataType) => a.id !== id)
    const ratedMovies = value === 0 ? filteredMovies : [...filteredMovies, newRatedMovie]

    localStorage.setItem('ratedMovies', JSON.stringify(ratedMovies))
  }

  render() {
    const { overview, posterPath, title, realiseDate, voteAverage, genreIds } = this.props
    const { allGenres } = this.context
    const { rateVal } = this.state

    const genres = getMovieGenres(genreIds, allGenres)
    const date = getMovieDate(realiseDate)
    const text = textSlice(overview)
    const rate = voteAverage.toFixed(1)

    const rateClassName = cn(
      'card__rate',
      voteAverage > 0 && voteAverage <= 3 && 'low',
      voteAverage > 3 && voteAverage <= 5 && 'average',
      voteAverage > 5 && voteAverage <= 7 && 'good',
      voteAverage > 7 && 'high'
    )

    const itemFooter = (
      <>
        {text && <Text className="card__text">{text}</Text>}
        <Rate className="card__stars" count={10} allowHalf value={rateVal} onChange={this.onChangeRate} />
      </>
    )

    const ellipsis = {
      tooltip: title,
    }

    return (
      <Card className="card">
        <div className="card__wrap">
          <Image
            rootClassName="card__image"
            placeholder={<Skeleton.Image className="card__skeleton" active />}
            src={posterPath && `https://image.tmdb.org/t/p/w500${posterPath}`}
            fallback={fallback}
          />

          <div className="card__body">
            <Space className="card__header">
              <Paragraph className="card__title" ellipsis={ellipsis}>
                {title}
              </Paragraph>
              {voteAverage !== 0 && <div className={rateClassName}>{rate}</div>}
            </Space>

            {date && <Text type="secondary">{date}</Text>}

            <Space size={[0, 'small']} wrap>
              {genres.map((name: string, i: number) => {
                const key = `${name}${i}`
                return <Tag key={key}>{name}</Tag>
              })}
            </Space>

            {itemFooter}
          </div>
        </div>

        {itemFooter}
      </Card>
    )
  }
}

MovieItem.contextType = MovieContext

export default MovieItem
