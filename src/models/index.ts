export type MovieType = {
  id: number
  overview: string
  original_title: string
  release_date: string
  poster_path: string
  vote_average: number
  genre_ids: Array<number>
  vote_count: number
  rating?: number
}

export type ResponseType = { results: MovieType[]; total: number; page: number }

export type MoviesDataType = { movies: MovieType[]; total: number; page: number }

export type MovieContextType = {
  query: string
  allMovies: MoviesDataType
  ratedMovies: MoviesDataType
  isChanged: boolean[]
  guestId: string
  apiBase: string
  allGenres: Array<{ id: number; name: string }>

  getResource: (url: string, hasApiKey?: boolean) => Promise<ResponseType>
  searchMovies: (query: string) => Promise<void>
  createGuestSession: () => Promise<string>
  getMovies: (page: number) => Promise<void>
  getRatedMovies: () => Promise<void>
  getGenres: () => Promise<void>
  setResource: (url: string, body: object) => Promise<void>
  setRate: (movieId: number, rate: number) => Promise<void>
  deleteResource: (url: string) => Promise<void>
  deleteRate: (movieId: number) => Promise<void>
}

export type LsDataType = {
  rating: number
  id: number
}

export type NamesType = Array<((page: number) => Promise<void>) & MoviesDataType & boolean>
