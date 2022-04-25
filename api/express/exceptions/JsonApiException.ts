export class JsonApiException extends Error {
  public status: string
  public code: number
  public title: string
  public detail: string
  constructor(...args: any) {
    super(...args)
    Error.captureStackTrace(this, JsonApiException)
    this.status = 'Bad Request'
    this.code = 400
    this.title = 'JSON:API Validation Error'
    this.detail = this.message
  }
}

export default JsonApiException
