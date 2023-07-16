import {
  ArrayCloneHandler,
  CloneHandler,
  DateCloneHandler,
  MapCloneHandler,
  ObjectCloneHandler,
  SetCloneHandler,
} from '../clone-handlers'

export class CloneService {
  private static recursivelyHandler?: CloneHandler

  public static execute<TBaseState>(aBaseState: TBaseState): TBaseState {
    if (!this.recursivelyHandler) {
      const objectCloneHandler = new ObjectCloneHandler()
      const arrayCloneHandler = new ArrayCloneHandler(objectCloneHandler)
      const mapCloneHandler = new MapCloneHandler(arrayCloneHandler)
      const setCloneHandler = new SetCloneHandler(mapCloneHandler)
      const dateCloneHandler = new DateCloneHandler(setCloneHandler)
      this.recursivelyHandler = dateCloneHandler
    }

    return this.recursivelyHandler.handle(
      aBaseState,
      this.execute.bind(this),
    ) as TBaseState
  }
}
