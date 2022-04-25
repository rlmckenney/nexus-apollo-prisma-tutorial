import {Request, Response, NextFunction} from 'express'
import {formatObject, formatCollection} from '../utils/json-api-response'
import {db} from '../../db'

/**
 * If needed, the Post type definition can be imported from the prisma client.
 * import { type Post } from '@prisma/client'
 */

/**
 * The response payloads will be formatted following the JSON.API standard.
 * For simplicity, minimum error handling is included in these examples.
 * We will add better error handling in a later stage of the tutorial.
 */
const RESOURCE_TYPE = 'post'

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const posts = await db.post.findMany({})
    const data = formatCollection({
      sourceCollection: posts,
      type: RESOURCE_TYPE
    })
    res.json({data})
  } catch (err) {
    next(err)
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const createdPost = await db.post.create({data: req.body.data.attributes})
    const data = formatObject({sourceObject: createdPost, type: RESOURCE_TYPE})
    res.status(201).json({data})
  } catch (err) {
    next(err)
  }
}

export async function get(req: Request, res: Response, next: NextFunction) {
  try {
    const postId = parseInt(req.params.id, 10)
    const post = await db.post.findUnique({
      where: {id: postId},
      include: {author: true}
    })
    const data = post
      ? formatObject({
          sourceObject: post,
          type: RESOURCE_TYPE,
          relations: ['author']
        })
      : null
    res.status(200).json({data})
  } catch (err) {
    next(err)
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const postId = parseInt(req.params.id, 10)
    const updatedPost = await db.post.update({
      where: {id: postId},
      data: req.body.data.attributes
    })
    const data = formatObject({sourceObject: updatedPost, type: RESOURCE_TYPE})
    res.status(200).json({data})
  } catch (err) {
    next(err)
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const postId = parseInt(req.params.id, 10)
    await db.post.delete({where: {id: postId}})
    res.status(204).json()
  } catch (err) {
    next(err)
  }
}
