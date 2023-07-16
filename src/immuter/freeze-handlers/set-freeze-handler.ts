import { CannotAssignToImmutableSetError } from '../shared/errors/cannot-assign-to-immutable-set-error'
import { TypeCheck } from '../type-check'
import { FreezeHandler, FreezeServiceExecuteCallback } from './freeze-handler'

export class SetFreezeHandler extends FreezeHandler {
  public handle(
    aType: unknown,
    freezeServiceExecute: FreezeServiceExecuteCallback<unknown>,
  ): unknown {
    if (TypeCheck.isSet(aType)) {
      return this.freezeSet(aType)
    }
    return this.handleNext(aType, freezeServiceExecute)
  }

  private freezeSet(aSet: Set<unknown>): Readonly<Set<unknown>> {
    aSet.add = this.throwError
    aSet.delete = this.throwError
    aSet.clear = this.throwError
    return this.freeze(aSet) as Readonly<Set<unknown>>
  }

  private throwError(): never {
    throw new CannotAssignToImmutableSetError()
  }
}
