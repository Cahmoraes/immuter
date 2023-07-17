import { CloneExceptionError } from './errors/clone-exception-error'

type CloneServiceExecuteCallback<Type> = (baseState: Type) => Type

type TypedPropertyDescriptorOf<TBaseState> = {
  [P in keyof TBaseState]: TypedPropertyDescriptor<TBaseState[P]>
} & {
  [x: string]: PropertyDescriptor
}

export class CloneRecursively {
  public static execute(
    aBaseStateCloned: object,
    strategyRecursively: CloneServiceExecuteCallback<unknown>,
  ) {
    try {
      return this.performClone(aBaseStateCloned, strategyRecursively)
    } catch (error) {
      if (error instanceof Error) throw new CloneExceptionError(error.message)
    }
  }

  private static performClone(
    aBaseStateCloned: object,
    aStrategyRecursively: CloneServiceExecuteCallback<unknown>,
  ) {
    const objectToClone = this.createCloneOf(aBaseStateCloned)
    const descriptors = this.propertyDescriptorsOf(aBaseStateCloned)
    for (const descriptor of Reflect.ownKeys(descriptors)) {
      if (this.isEligibleToAssign(descriptors, descriptor)) {
        objectToClone[descriptor] = aStrategyRecursively(
          Reflect.get(objectToClone, descriptor),
        )
      }
    }
    return objectToClone
  }

  private static createCloneOf<TBaseState>(aBaseState: TBaseState) {
    return Object.create(
      this.prototypeOf(aBaseState),
      this.propertyDescriptorsOf(aBaseState),
    )
  }

  private static prototypeOf<TBaseState>(aBaseState: TBaseState) {
    return Object.getPrototypeOf(aBaseState)
  }

  private static propertyDescriptorsOf<TBaseState>(aBaseState: TBaseState) {
    return Object.getOwnPropertyDescriptors(aBaseState)
  }

  private static isEligibleToAssign<TBaseState>(
    descriptors: TypedPropertyDescriptorOf<TBaseState>,
    descriptor: keyof TBaseState | string | symbol,
  ): descriptor is keyof TBaseState {
    return (
      descriptors[String(descriptor)] &&
      Reflect.has(descriptors[String(descriptor)], 'value')
    )
  }
}
