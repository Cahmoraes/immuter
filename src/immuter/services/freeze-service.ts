import {
  ArrayFreezeHandler,
  FreezeHandler,
  MapFreezeHandler,
  ObjectFreezeHandler,
  SetFreezeHandler,
} from '../freeze-handlers'

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
