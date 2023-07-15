import { CloneHandler, CloneRecursively } from '.'
import { TypeCheck } from '../type-check'

type TypedPropertyDescriptorOf<TBaseState> = {
  [P in keyof TBaseState]: TypedPropertyDescriptor<TBaseState[P]>
} & {
  [x: string]: PropertyDescriptor
}

export class ObjectCloneHandler extends CloneHandler {
  public handle(aType: unknown, cloneRecursively: CloneRecursively<unknown>) {
    if (TypeCheck.isObject(aType)) {
      return this.cloneRecursively(this.createCloneOf(aType), cloneRecursively)
    }
    return this.handleNext(aType, cloneRecursively)
  }

  private createCloneOf<TBaseState>(aBaseState: TBaseState) {
    return Object.create(
      this.prototypeOf(aBaseState),
      this.propertyDescriptorsOf(aBaseState),
    )
  }

  private propertyDescriptorsOf<TBaseState>(aBaseState: TBaseState) {
    return Object.getOwnPropertyDescriptors(aBaseState)
  }

  private prototypeOf<TBaseState>(aBaseState: TBaseState) {
    return Object.getPrototypeOf(aBaseState)
  }

  private cloneRecursively<TBaseState extends Record<PropertyKey, unknown>>(
    aBaseStateCloned: TBaseState,
    cloneRecursively: CloneRecursively<unknown>,
  ) {
    const objectToClone = aBaseStateCloned as Record<string, unknown>
    const descriptors = this.propertyDescriptorsOf(aBaseStateCloned)
    for (const descriptor of Reflect.ownKeys(descriptors)) {
      if (
        !this.isEligibleToAssign<typeof objectToClone>(descriptors, descriptor)
      )
        continue
      objectToClone[descriptor] = cloneRecursively(
        Reflect.get(objectToClone, descriptor),
      )
    }
    return objectToClone
  }

  private isEligibleToAssign<TBaseState>(
    descriptors: TypedPropertyDescriptorOf<TBaseState>,
    descriptor: keyof TBaseState | string | symbol,
  ): descriptor is keyof TBaseState {
    return (
      descriptors[String(descriptor)] &&
      Reflect.has(descriptors[String(descriptor)], 'value')
    )
  }
}
