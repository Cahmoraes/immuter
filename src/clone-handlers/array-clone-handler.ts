import { CloneHandler, CloneRecursively } from '.'
import { TypeCheck } from '../type-check'

export class ArrayCloneHandler extends CloneHandler {
  public handle(
    aType: unknown,
    cloneRecursively: CloneRecursively<unknown>,
  ): unknown {
    if (TypeCheck.isArray(aType)) {
      return this.createCloneOf(aType)
    }
    return this.handleNext(aType, cloneRecursively)
  }

  private createCloneOf(aType: unknown[]): unknown[] {
    return [...aType]
  }
}
