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
  private static globalImmuterInstance = new Immuter(initialState)

  private constructor(private readonly config: ImmuterConfigProps) {}

  public static get global() {
    return {
      not: {
        freeze: () => {
          this.globalImmuterInstance = new Immuter({
            freeze: false,
          })
        },
      },
      freeze: () => {
        this.globalImmuterInstance = new Immuter(initialState)
      },
    }
  }

  public static get not() {
    return {
      freeze: new Immuter({
        freeze: false,
      }),
    }
  }

  public static produce<TBaseState extends object>(
    aBaseState: TBaseState,
    aProducer: Producer<TBaseState>,
  ) {
    return this.globalImmuterInstance.produce(aBaseState, aProducer)
  }

  public static clone<TBaseState extends object>(
    aBaseState: TBaseState,
  ): TBaseState {
    return this.globalImmuterInstance.clone(aBaseState)
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
