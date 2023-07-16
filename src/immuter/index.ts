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

  public static get not() {
    return {
      freeze: this.freeze(false),
    }
  }

  private static freeze(value: boolean) {
    this.config.freeze = value
    return {
      clone: this.clone.bind(this),
      produce: this.produce.bind(this),
    }
  }

  public static clone<TBaseState extends object>(
    aBaseState: TBaseState,
  ): TBaseState {
    const draftState = CloneService.execute(aBaseState)
    return this.execute(draftState)
  }

  private static execute<TBaseState extends object>(
    aDraftState: TBaseState,
  ): TBaseState {
    const result = this.freezeIfNecessary(aDraftState)
    Immuter.resetConfig()
    return result
  }

  private static freezeIfNecessary<TBaseState extends object>(
    aDraftState: TBaseState,
  ) {
    return Immuter.config.freeze
      ? FreezeService.execute(aDraftState)
      : aDraftState
  }

  private static resetConfig() {
    this.config.freeze = true
  }

  public static produce<TBaseState extends object>(
    aBaseState: TBaseState,
    produce: Produce<TBaseState>,
  ): TBaseState {
    const draftState = CloneService.execute(aBaseState)
    ProduceService.execute(draftState, produce)
    return this.execute(draftState)
  }
}
