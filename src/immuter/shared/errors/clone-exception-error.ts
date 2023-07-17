export class CloneExceptionError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'CloneExceptionError'
  }
}
