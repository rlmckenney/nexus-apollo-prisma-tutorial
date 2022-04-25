import {JsonApiException} from '../exceptions/JsonApiException'
import {Request, Response, NextFunction} from 'express'

export function errorHandler(
  err: JsonApiException,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const statusCode = err.code ?? 500
  res.status(statusCode).json({
    errors: [err]
  })
}
