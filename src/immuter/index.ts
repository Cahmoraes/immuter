import { ImmuterGlobalConfig } from '../immuter-global-config'
import { CloneService } from './services/clone-service'
import { FreezeService } from './services/freeze-service'
import { ProduceService } from './services/produce-service'

type Produce<TBaseState> = (draftState: TBaseState) => void

export type ImmuterGlobalConfigType = {
  freeze: boolean
  global: boolean
}

type ImmuterConfigType = {
  freeze: boolean
  global: boolean
}

export class Immuter {
  private static globalConfig: ImmuterGlobalConfigType = {
    freeze: true,
    global: true,
  }

  private static immuterGlobalConfig = new ImmuterGlobalConfig({
    setFreezeConfig: Immuter.setFreezeConfig.bind(this),
    setGlobalConfig: Immuter.setGlobalConfig.bind(this),
  })

  private static setFreezeConfig(aBoolean: boolean) {
    this.globalConfig.freeze = aBoolean
  }

  private static setGlobalConfig(aBoolean: boolean) {
    this.globalConfig.global = aBoolean
  }

  public static get global() {
    return this.immuterGlobalConfig
  }

  public static get not() {
    return {
      freeze: new Immuter({
        freeze: false,
        global: false,
      }),
    }
  }

  // private static setFreezeAndReturnMethods() {
  //   this.setFreezeConfig(false)
  //   return {
  //     clone: this.clone.bind(this),
  //     produce: this.produce.bind(this),
  //   }
  // }

  private config = {
    freeze: true,
    global: false,
  }

  private constructor(config: ImmuterConfigType) {
    this.config = config
  }

  public clone<TBaseState extends object>(aBaseState: TBaseState): TBaseState {
    const draftState = CloneService.execute(aBaseState)
    return this.execute(draftState)
  }

  public static produce<TBaseState extends object>(
    aBaseState: TBaseState,
    produce: Produce<TBaseState>,
  ) {
    return new Immuter({
      freeze: this.globalConfig.freeze,
      global: this.globalConfig.global,
    }).produce(aBaseState, produce)
  }

  public static clone<TBaseState extends object>(
    aBaseState: TBaseState,
  ): TBaseState {
    return new Immuter({
      freeze: true,
      global: true,
    }).clone(aBaseState)
  }

  private execute<TBaseState extends object>(
    aDraftState: TBaseState,
  ): TBaseState {
    const result = this.freezeIfNecessary(aDraftState)
    // this.resetFreezeConfig()
    return result
  }

  private freezeIfNecessary<TBaseState extends object>(
    aDraftState: TBaseState,
  ) {
    return this.config.freeze ? FreezeService.execute(aDraftState) : aDraftState
  }

  // private resetFreezeConfig() {
  //   this.config.global && !this.config.freeze
  //     ? this.setFreezeConfig(false)
  //     : this.setFreezeConfig(true)
  // }

  public produce<TBaseState extends object>(
    aBaseState: TBaseState,
    produce: Produce<TBaseState>,
  ): TBaseState {
    const draftState = CloneService.execute(aBaseState)
    ProduceService.execute(draftState, produce)
    return this.execute(draftState)
  }
}
