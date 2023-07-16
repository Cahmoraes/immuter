import { ArrayFreezeHandler } from './freeze-handlers/array-freeze-handler'
import { FreezeHandler } from './freeze-handlers/freeze-handler'
import { MapFreezeHandler } from './freeze-handlers/map-freeze-handler'
import { ObjectFreezeHandler } from './freeze-handlers/object-freeze-handler'
import { SetFreezeHandler } from './freeze-handlers/set-freeze-handler'

export class FreezeService {
  private static recursivelyHandler?: FreezeHandler

  public static execute<TBaseState>(aBaseState: TBaseState): TBaseState {
    if (!this.recursivelyHandler) {
      const setFreezeHandler = new SetFreezeHandler()
      const mapFreezeHandler = new MapFreezeHandler(setFreezeHandler)
      const objectFreezeHandler = new ObjectFreezeHandler(mapFreezeHandler)
      const arrayFreezeHandler = new ArrayFreezeHandler(objectFreezeHandler)
      this.recursivelyHandler = arrayFreezeHandler
    }

    return this.recursivelyHandler.handle(
      aBaseState,
      this.execute.bind(this),
    ) as TBaseState
  }
}
