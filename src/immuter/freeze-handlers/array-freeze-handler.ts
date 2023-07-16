import { CloneService } from '../services/clone-service'
import { TypeCheck } from '../shared/type-check'
import { FreezeHandler, FreezeServiceExecuteCallback } from './freeze-handler'

export class ArrayFreezeHandler extends FreezeHandler {
  public handle(
    aType: unknown,
    freezeServiceExecute: FreezeServiceExecuteCallback<unknown>,
  ): unknown {
    if (TypeCheck.isArray(aType)) {
      return this.freeze(
        this.createCloneOf(CloneService.execute(aType), freezeServiceExecute),
      )
    }
    return this.handleNext(aType, freezeServiceExecute)
  }

  private createCloneOf(
    aType: unknown[],
    freezeRecursively: FreezeServiceExecuteCallback<unknown>,
  ): unknown[] {
    return aType.map(freezeRecursively)
  }
}
