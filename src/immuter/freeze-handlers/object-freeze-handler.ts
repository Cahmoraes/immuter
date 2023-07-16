import { CloneService } from '../clone-service'
import { CloneRecursively } from '../shared/clone-recursively'
import { TypeCheck } from '../type-check'
import { FreezeHandler, FreezeServiceExecuteCallback } from './freeze-handler'

export class ObjectFreezeHandler extends FreezeHandler {
  public handle(
    aType: unknown,
    freezeServiceExecute: FreezeServiceExecuteCallback<unknown>,
  ): unknown {
    if (TypeCheck.isObject(aType)) {
      return this.freeze(
        CloneRecursively.execute(
          CloneService.execute(aType),
          freezeServiceExecute,
        ),
      )
    }
    return this.handleNext(aType, freezeServiceExecute)
  }
}
