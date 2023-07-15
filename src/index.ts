import { CloneService } from './clone-service'

type Produce<TBaseState> = (draftState: TBaseState) => void

export class Immuter {
  static produce<TBaseState>(
    aBaseState: TBaseState,
    produce: Produce<TBaseState>,
  ) {
    const clone = CloneService.execute(aBaseState)
    return clone
  }
}
