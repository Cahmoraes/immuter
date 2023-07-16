import { CannotAssignToImmutableMapError } from '../shared/errors/cannot-assign-to-immutable-map-error'
import { TypeCheck } from '../shared/type-check'
import { FreezeHandler, FreezeServiceExecuteCallback } from './freeze-handler'

export class MapFreezeHandler extends FreezeHandler {
  public handle(
    aType: unknown,
    freezeServiceExecute: FreezeServiceExecuteCallback<unknown>,
  ): unknown {
    if (TypeCheck.isMap(aType)) {
      return this.freezeMap(aType)
    }
    return this.handleNext(aType, freezeServiceExecute)
  }

  private freezeMap(
    aMap: Map<unknown, unknown>,
  ): Readonly<Map<unknown, unknown>> {
    aMap.set = this.throwError
    aMap.delete = this.throwError
    aMap.clear = this.throwError
    return this.freeze(aMap) as Readonly<Map<unknown, unknown>>
  }

  private throwError(): never {
    throw new CannotAssignToImmutableMapError()
  }
}
