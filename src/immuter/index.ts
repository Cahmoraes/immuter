import { CloneService } from './services/clone-service'
import { FreezeService } from './services/freeze-service'
import { ProduceService } from './services/produce-service'

type Producer<TBaseState> = (draftState: TBaseState) => void
type ImmuterConfigProps = {
  freeze: boolean
}

const initialState: ImmuterConfigProps = {
  freeze: true,
}

export class Immuter {
  private static instance = this.createImmutable()
  private constructor(private readonly config: ImmuterConfigProps) {}

  private static createImmutable(): Immuter {
    return new Immuter(initialState)
  }

  private static createMutable(): Immuter {
    return new Immuter({
      freeze: false,
    })
  }

  public static get global() {
    return {
      not: {
        freeze: () => {
          this.instance = this.createMutable()
        },
      },
      freeze: () => {
        this.instance = this.createImmutable()
      },
    }
  }

  public static get not() {
    return {
      freeze: this.createMutable(),
    }
  }

  public static produce<TBaseState extends object>(
    aBaseState: TBaseState,
    aProducer: Producer<TBaseState>,
  ) {
    return this.instance.produce(aBaseState, aProducer)
  }

  public static clone<TBaseState extends object>(
    aBaseState: TBaseState,
  ): TBaseState {
    return this.instance.clone(aBaseState)
  }

  public clone<TBaseState extends object>(aBaseState: TBaseState): TBaseState {
    const draftState = CloneService.execute(aBaseState)
    return this.execute(draftState)
  }

  private execute<TBaseState extends object>(
    aDraftState: TBaseState,
  ): TBaseState {
    const result = this.freezeIfNecessary(aDraftState)
    return result
  }

  private freezeIfNecessary<TBaseState extends object>(
    aDraftState: TBaseState,
  ) {
    return this.config.freeze ? FreezeService.execute(aDraftState) : aDraftState
  }

  public produce<TBaseState extends object>(
    aBaseState: TBaseState,
    produce: Producer<TBaseState>,
  ): TBaseState {
    const draftState = CloneService.execute(aBaseState)
    ProduceService.execute(draftState, produce)
    return this.execute(draftState)
  }
}
