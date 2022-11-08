export class AppError extends Error {
  statusCode: number

  constructor(statusCode: number, message: string) {
    super()
    this.statusCode = statusCode
    this.message = message
  }
}

export const createAppError = (statusCode: number, message: string) => {
  return new AppError(statusCode, message)
}
