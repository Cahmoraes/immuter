import { CloneHandler, CloneServiceExecuteCallback } from './clone-handler'
import { TypeCheck } from '../shared/type-check'
import { CloneRecursively } from '../shared/clone-recursively'

export class ObjectCloneHandler extends CloneHandler {
  public handle(
    aType: unknown,
    cloneServiceExecute: CloneServiceExecuteCallback<unknown>,
  ) {
    if (TypeCheck.isObject(aType)) {
      return CloneRecursively.execute(aType, cloneServiceExecute)
    }
    return this.handleNext(aType, cloneServiceExecute)
  }
}
