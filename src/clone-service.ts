import { CloneHandler } from './clone-handlers'
import { ArrayCloneHandler } from './clone-handlers/array-clone-handler'
import { DateCloneHandler } from './clone-handlers/date-clone-handler'
import { MapCloneHandler } from './clone-handlers/map-clone-handler'
import { ObjectCloneHandler } from './clone-handlers/object-clone-handler'
import { SetCloneHandler } from './clone-handlers/set-clone-handler'

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
