import { format } from 'date-fns'

import { MovieType } from '../models'

const cn = (...classes: Array<boolean | string>) => [...classes].filter(Boolean).join(' ')

const getFromLs = (movies: Array<MovieType>) => {
  const lsData = localStorage?.getItem('ratedMovies') ? JSON.parse(localStorage?.getItem('ratedMovies') || '') : []

  const ratedMovies = [] as Array<MovieType>

  if (lsData.length) {
    movies.forEach((m: MovieType) => {
      lsData.forEach(({ id, rating }: MovieType) => {
        if (m.id === id && !ratedMovies.some((r: MovieType) => m.id === r.id)) {
          ratedMovies.push({ ...m, rating })
        }
      })
      if (!ratedMovies.some((r: MovieType) => m.id === r.id)) {
        ratedMovies.push(m)
      }
    })
  }

  return ratedMovies.length ? ratedMovies : movies
}

const setLsGuestId = async (cb: () => Promise<string>, onError: () => void) => {
  const guestId = localStorage.getItem('guestId')

  if (!guestId) {
    if (localStorage.getItem('ratedMovies')) {
      localStorage.removeItem('ratedMovies')
    }

    cb()
      .then((newGuestId: string) => localStorage.setItem('guestId', newGuestId))
      .catch(onError)
  }
}

const getMovieGenres = (genreIds: Array<number>, allGenres: Array<{ id: number; name: string }>) => {
  if (!genreIds.length) {
    return []
  }

  const genres = [] as Array<string>
  genreIds.forEach((currId: number) =>
    allGenres.forEach(({ id, name }) => {
      if (currId === id) {
        genres.push(name)
      }
    })
  )
  return genres
}

const getMovieDate = (realiseDate: string) => {
  if (!realiseDate) {
    return ''
  }

  const currD = new Date(
    realiseDate
      .split('-')
      .map((i) => Number(i))
      .join()
  )

  return format(currD, 'MMMM d, yyyy')
}

const textSlice = (text: string, value = 200, symbol = '...') => {
  if (text.length < value) {
    return text
  }

  const slicedText = text.slice(0, value)
  const hasLastSym = slicedText[value - 1] !== undefined
  const result = hasLastSym ? slicedText.split(' ').slice(0, -1).join(' ') : slicedText

  return `${result} ${symbol}`
}

export { cn, getFromLs, setLsGuestId, getMovieGenres, getMovieDate, textSlice }
