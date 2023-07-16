import { CloneHandler, CloneServiceExecuteCallback } from './clone-handler'
import { TypeCheck } from '../type-check'

export class DateCloneHandler extends CloneHandler {
  public handle<TBaseState>(
    aType: TBaseState,
    cloneRecursively: CloneServiceExecuteCallback<unknown>,
  ) {
    if (TypeCheck.isDate(aType)) {
      return new Date(aType)
    }
    return this.handleNext(aType, cloneRecursively)
  }
}
