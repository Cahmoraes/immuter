import { CloneService } from './services/clone-service'
import { FreezeService } from './services/freeze-service'
import { ProduceService } from './services/produce-service'

type Produce<TBaseState> = (draftState: TBaseState) => void

export type ImmuterConfig = {
  freeze: boolean
}

export class Immuter {
  private static config: ImmuterConfig = {
    freeze: true,
  }

  private static get freeze() {
    this.config.freeze = false
    return {
      produce: this.produce,
    }
  }

  static get not() {
    return {
      freeze: this.freeze,
    }
  }

  static produce<TBaseState extends object>(
    aBaseState: TBaseState,
    produce: Produce<TBaseState>,
  ) {
    const draftState = CloneService.execute(aBaseState)
    ProduceService.execute(draftState, produce)

    return Immuter.config.freeze
      ? FreezeService.execute(draftState)
      : draftState
  }
}
