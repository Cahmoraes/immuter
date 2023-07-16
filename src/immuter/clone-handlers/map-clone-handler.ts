import { CloneHandler, CloneServiceExecuteCallback } from './clone-handler'
import { TypeCheck } from '../shared/type-check'

export class MapCloneHandler extends CloneHandler {
  public handle(
    aType: unknown,
    cloneServiceExecute: CloneServiceExecuteCallback<unknown>,
  ): unknown {
    if (TypeCheck.isMap(aType)) {
      return this.createCloneOf(aType, cloneServiceExecute)
    }
    return this.handleNext(aType, cloneServiceExecute)
  }

  private createCloneOf(
    aMap: Map<unknown, unknown>,
    cloneServiceExecute: CloneServiceExecuteCallback<unknown>,
  ) {
    const newMap = new Map(aMap)
    aMap.forEach((value, key) => newMap.set(key, cloneServiceExecute(value)))
    return newMap
  }
}
