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
      clone: this.clone,
    }
  }

  public static get not() {
    return {
      freeze: this.freeze,
    }
  }

  public static clone<TBaseState extends object>(aBaseState: TBaseState) {
    const draftState = CloneService.execute(aBaseState)
    const result = Immuter.config.freeze
      ? FreezeService.execute(draftState)
      : draftState

    Immuter.resetConfig()
    return result
  }

  public static produce<TBaseState extends object>(
    aBaseState: TBaseState,
    produce: Produce<TBaseState>,
  ) {
    const draftState = CloneService.execute(aBaseState)
    ProduceService.execute(draftState, produce)
    const result = Immuter.config.freeze
      ? FreezeService.execute(draftState)
      : draftState

    Immuter.resetConfig()
    return result
  }

  private static resetConfig() {
    this.config.freeze = true
  }
}
