export class CannotAssignToImmutableSetError extends Error {
  constructor() {
    super('Cannot assign to immutable Set')
    this.name = 'CannotAssignToImmutableSetError'
  }
}
