type ProducerCallback<TBaseState> = (draftState: TBaseState) => void

export class ProduceService {
  public static execute<TBaseState>(
    clonedBaseState: TBaseState,
    producer: ProducerCallback<TBaseState>,
  ) {
    producer(clonedBaseState)
  }
}
