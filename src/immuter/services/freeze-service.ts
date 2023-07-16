import {
  ArrayFreezeHandler,
  FreezeHandler,
  MapFreezeHandler,
  ObjectFreezeHandler,
  SetFreezeHandler,
} from '../freeze-handlers'
import { DateFreezeHandler } from '../freeze-handlers/date-clone-handler'

export class FreezeService {
  private static recursivelyHandler?: FreezeHandler

  public static execute<TBaseState>(aBaseState: TBaseState): TBaseState {
    if (!this.recursivelyHandler) {
      const setFreezeHandler = new SetFreezeHandler()
      const mapFreezeHandler = new MapFreezeHandler(setFreezeHandler)
      const objectFreezeHandler = new ObjectFreezeHandler(mapFreezeHandler)
      const arrayFreezeHandler = new ArrayFreezeHandler(objectFreezeHandler)
      const dateFreezeHandler = new DateFreezeHandler(arrayFreezeHandler)
      this.recursivelyHandler = dateFreezeHandler
    }

    return this.recursivelyHandler.handle(
      aBaseState,
      this.execute.bind(this),
    ) as TBaseState
  }
}
