import { CloneHandler, CloneServiceExecuteCallback } from './clone-handler'
import { TypeCheck } from '../shared/type-check'

export class ArrayCloneHandler extends CloneHandler {
  public handle(
    aType: unknown,
    cloneRecursively: CloneServiceExecuteCallback<unknown>,
  ): unknown {
    if (TypeCheck.isArray(aType)) {
      return this.createCloneOf(aType, cloneRecursively)
    }
    return this.handleNext(aType, cloneRecursively)
  }

  private createCloneOf(
    aType: unknown[],
    cloneRecursively: CloneServiceExecuteCallback<unknown>,
  ): unknown[] {
    return aType.map(cloneRecursively)
  }
}
