import express from 'express'
import type { IRouter } from 'express'
import {allFavorites, addFavorite, deleteFavorite, search} from '../controllers/favoriteController'
import {tokenCheck} from '../middleware/authMiddleware'

export const favoriteRoute: IRouter = express.Router();

favoriteRoute.get('/favorites', tokenCheck, allFavorites)
favoriteRoute.get('/search/:username', search)//makes the search pbulic for non-users without middleware
favoriteRoute.post('/favorites', tokenCheck, addFavorite)
favoriteRoute.delete('/favorites/:id', tokenCheck, deleteFavorite)