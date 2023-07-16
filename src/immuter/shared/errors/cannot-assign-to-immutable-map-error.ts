export class CannotAssignToImmutableMapError extends Error {
  constructor() {
    super('Cannot assign to immutable Map')
    this.name = 'CannotAssignToImmutableMapError'
  }
}
