import { CloneHandler, CloneServiceExecuteCallback } from './clone-handler'
import { TypeCheck } from '../type-check'

export class SetCloneHandler extends CloneHandler {
  public handle(
    aType: unknown,
    cloneServiceExecute: CloneServiceExecuteCallback<unknown>,
  ): unknown {
    if (TypeCheck.isSet(aType)) {
      return this.createCloneOf(aType, cloneServiceExecute)
    }
    return this.handleNext(aType, cloneServiceExecute)
  }

  private createCloneOf(
    aSet: Set<unknown>,
    cloneServiceExecute: CloneServiceExecuteCallback<unknown>,
  ) {
    const newSet = new Set(aSet)
    aSet.forEach((value) => newSet.add(cloneServiceExecute(value)))
    return newSet
  }
}
