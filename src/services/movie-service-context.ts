import React from 'react'

import { MovieContextType } from '../models'

const MovieContext = React.createContext<MovieContextType | null>(null)

export default MovieContext
