import express from 'express'
import * as postController from './post.controller'
import {
  isExpectedFormat,
  validateResourceType
} from '../middleware/json-api.middleware'

export const postRouter = express.Router()

/**
 * Apply validation middleware here. The controller can assume clean data.
 */

postRouter.get('/posts/', postController.list)
postRouter.post(
  '/posts/',
  isExpectedFormat,
  validateResourceType('post'),
  postController.create
)
postRouter.get('/posts/:id(\\d+)', postController.get)
postRouter.patch(
  '/posts/:id(\\d+)',
  isExpectedFormat,
  validateResourceType('post'),
  postController.update
)
postRouter.delete('/posts/:id(\\d+)', postController.remove)
