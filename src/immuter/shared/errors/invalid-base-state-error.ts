export class InvalidBaseStateError extends TypeError {
  constructor(aType: string) {
    super(`Invalid baseState type: [${aType}]`)
    this.name = 'InvalidBaseStateError'
  }
}
