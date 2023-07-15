import { CloneHandler, CloneServiceExecuteCallback } from '.'
import { TypeCheck } from '../type-check'

type TypedPropertyDescriptorOf<TBaseState> = {
  [P in keyof TBaseState]: TypedPropertyDescriptor<TBaseState[P]>
} & {
  [x: string]: PropertyDescriptor
}

export class ObjectCloneHandler extends CloneHandler {
  public handle(
    aType: unknown,
    cloneServiceExecute: CloneServiceExecuteCallback<unknown>,
  ) {
    if (TypeCheck.isObject(aType)) {
      return this.cloneRecursively(
        this.createCloneOf(aType),
        cloneServiceExecute,
      )
    }
    return this.handleNext(aType, cloneServiceExecute)
  }

  private cloneRecursively<TBaseState extends Record<PropertyKey, unknown>>(
    aBaseStateCloned: TBaseState,
    cloneRecursively: CloneServiceExecuteCallback<unknown>,
  ) {
    const objectToClone: Record<string, unknown> = { ...aBaseStateCloned }
    const descriptors = this.propertyDescriptorsOf(aBaseStateCloned)
    for (const descriptor of Reflect.ownKeys(descriptors)) {
      this.isEligibleToAssign<typeof objectToClone>(descriptors, descriptor) &&
        (objectToClone[descriptor] = cloneRecursively(
          Reflect.get(objectToClone, descriptor),
        ))
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
}
