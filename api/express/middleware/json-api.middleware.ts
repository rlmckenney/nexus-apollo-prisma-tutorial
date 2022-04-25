import {JsonApiException} from './../exceptions/JsonApiException'
import {RequestHandler, Request, Response, NextFunction} from 'express'

export function isExpectedFormat(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const {data} = req.body
  try {
    if (!data) throw new JsonApiException(`Missing 'data' field`)
    if (!data.type) throw new JsonApiException(`Missing 'data.type' field`)
    if (!data.attributes)
      throw new JsonApiException(`Missing 'data.attributes' field`)
    next()
  } catch (err) {
    next(err)
  }
}

export function validateResourceType(resourceType: string): RequestHandler {
  return function (req, res, next) {
    try {
      const {type} = req.body.data
      if (type !== resourceType) {
        throw new JsonApiException(
          `Invalid resource type. Expected '${resourceType}', but got '${type}'`
        )
      }
      next()
    } catch (err) {
      next(err)
    }
  }
}
