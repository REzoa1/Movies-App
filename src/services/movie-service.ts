import { apiKey } from '../utils/constants'
import { getFromLs } from '../utils/helpers'

export default class MovieService {
  query = 'return'

  allMovies = { movies: [], total: 0, page: 1 }

  ratedMovies = { movies: [], total: 0, page: 1 }

  isChanged = [false, false]

  guestId = localStorage.getItem('guestId') || ''

  apiBase = 'https://api.themoviedb.org/3'

  allGenres = []

  getResource = async (url: string) => {
    const baseUrl = `${this.apiBase}${url}`

    const options = {
      method: 'GET',
      headers: { accept: 'application/json' },
    }

    const res = await fetch(baseUrl, options)

    if (!res.ok) {
      throw new Error(`Could not fetch, received ${res.status}`)
    }

    const data = await res.json()
    return data
  }

  searchMovies = async (query: string) => {
    const queryParams = `?api_key=${apiKey}&guest_session_id=${this.guestId}&query=${query}`
    const res = await this.getResource(`/search/movie${queryParams}`)
    this.query = query

    const lsData = res && getFromLs(res.results)
    this.allMovies = { total: res.total_results, movies: lsData, page: res.page }
    return lsData
  }

  createGuestSession = async () => {
    const res = await this.getResource(`/authentication/guest_session/new?api_key=${apiKey}`)
    this.guestId = res.guest_session_id

    return res.guest_session_id
  }

  getMovies = async (page: number) => {
    const queryParams = `?api_key=${apiKey}&guest_session_id=${this.guestId}&query=${this.query}&include_adult=false&page=${page}`
    const res = await this.getResource(`/search/movie${queryParams}`)
    this.isChanged = [false, this.isChanged[1]]

    const lsData = res && getFromLs(res.results)
    this.allMovies = { total: res.total_results, movies: lsData, page: res.page }
    return lsData
  }

  getRatedMovies = async (page = 1) => {
    const queryParams = `?page=${page}&api_key=${apiKey}`
    const res = await this.getResource(`/guest_session/${this.guestId}/rated/movies${queryParams}`)
    this.isChanged = [this.isChanged[0], false]

    this.ratedMovies = { total: res.total_results, movies: res.results, page }

    return res.results
  }

  getGenres = async () => {
    const res = await this.getResource(`/genre/movie/list?language=en&api_key=${apiKey}`)
    this.allGenres = res.genres

    return res.allGenres
  }

  setResource = async (url: string, body: object) => {
    const baseUrl = `${this.apiBase}${url}`

    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(body),
    }

    const res = await fetch(baseUrl, options)

    if (!res.ok) {
      throw new Error(`Could not fetch, received ${res.status}`)
    }

    const data = await res.json()
    return data
  }

  setRate = async (movieId: number, rate: number) => {
    const res = this.setResource(`/movie/${movieId}/rating?guest_session_id=${this.guestId}&api_key=${apiKey}`, {
      value: rate,
    })
    this.isChanged = [true, true]

    return res
  }

  deleteResource = async (url: string) => {
    const baseUrl = `${this.apiBase}${url}`

    const options = {
      method: 'DELETE',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
      },
    }

    const res = await fetch(baseUrl, options)

    if (!res.ok) {
      throw new Error(`Could not fetch, received ${res.status}`)
    }

    const data = await res.json()
    return data
  }

  deleteRate = async (movieId: number) => {
    const res = this.deleteResource(`/movie/${movieId}/rating?guest_session_id=${this.guestId}&api_key=${apiKey}`)
    this.isChanged = [true, true]

    return res
  }
}
