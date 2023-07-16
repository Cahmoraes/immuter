type ProducerCallback<TBaseState> = (draftState: TBaseState) => void

export class ProduceService {
  public static execute<TBaseState>(
    draftState: TBaseState,
    producer: ProducerCallback<TBaseState>,
  ) {
    producer(draftState)
  }
}
