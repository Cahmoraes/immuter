import { CloneService } from './../services/clone-service'
import { TypeCheck } from '../shared/type-check'
import { FreezeHandler, FreezeServiceExecuteCallback } from './freeze-handler'

export class DateFreezeHandler extends FreezeHandler {
  public handle(
    aType: unknown,
    freezeServiceExecute: FreezeServiceExecuteCallback<unknown>,
  ): unknown {
    if (TypeCheck.isDate(aType)) {
      return this.freeze(CloneService.execute(aType))
    }
    return this.handleNext(aType, freezeServiceExecute)
  }
}
