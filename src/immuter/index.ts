import { GlobalConfig } from '../immuter-global-config'
import { CloneService } from './services/clone-service'
import { FreezeService } from './services/freeze-service'
import { ProduceService } from './services/produce-service'

type Produce<TBaseState> = (draftState: TBaseState) => void

export type ImmuterConfig = {
  freeze: boolean
  global: boolean
}

export class Immuter {
  private static config: ImmuterConfig = {
    freeze: true,
    global: false,
  }

  private static setGlobalConfig(aBoolean: boolean) {
    this.config.global = aBoolean
  }

  private static setFreezeConfig(aBoolean: boolean) {
    this.config.freeze = aBoolean
  }

  private static globalImmuterConfig = new GlobalConfig({
    setFreezeConfig: Immuter.setFreezeConfig.bind(this),
    setGlobalConfig: Immuter.setGlobalConfig.bind(this),
  })

  public static get global() {
    return this.globalImmuterConfig
  }

  public static get not() {
    return {
      freeze: this.setFreeze(false),
    }
  }

  private static setFreeze(aBoolean: boolean) {
    this.config.freeze = aBoolean
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
    this.config.global ? this.setFreeze(false) : this.setFreeze(true)
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
