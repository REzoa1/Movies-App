import React from 'react'
import { Alert, Empty, Flex, Pagination, Spin } from 'antd'

import MovieItem from '../MovieItem/MovieItem'
import { MovieType, MoviesDataType } from '../../models'
import './MoviesList.scss'

type Props = {
  moviesData: MoviesDataType
  isLoading: boolean
  hasError: boolean
  onChange: (page: number) => void
}

function MoviesList({ moviesData, isLoading, hasError, onChange }: Props) {
  const { movies, total, page } = moviesData

  const data = movies?.length ? (
    movies.map(
      ({ id, original_title, genre_ids, overview, poster_path, release_date, vote_average, rating }: MovieType) => {
        return (
          <MovieItem
            key={id}
            id={id}
            title={original_title}
            genreIds={genre_ids}
            overview={overview}
            posterPath={poster_path}
            realiseDate={release_date}
            voteAverage={vote_average}
            rating={rating}
          />
        )
      }
    )
  ) : (
    <Empty className="empty" />
  )

  const loader = <Spin className="spinner" />

  const error = (
    <Alert className="alert" showIcon message="Error" description="Ooops... Something went wrong." type="error" />
  )

  return (
    <>
      {hasError ? (
        error
      ) : (
        <Flex className="data-wrap" wrap="wrap" align="start">
          {isLoading ? loader : data}
        </Flex>
      )}

      {!hasError && !isLoading && movies.length !== 0 && (
        <Pagination
          showSizeChanger={false}
          defaultPageSize={20}
          pageSize={20}
          current={page}
          onChange={onChange}
          total={total}
        />
      )}
    </>
  )
}

export default MoviesList
