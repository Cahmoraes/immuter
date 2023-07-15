import { CloneService } from '../clone-service'
import { TypeCheck } from '../type-check'
import { FreezeHandler, FreezeServiceExecuteCallback } from './freeze-handler'

type TypedPropertyDescriptorOf<TBaseState> = {
  [P in keyof TBaseState]: TypedPropertyDescriptor<TBaseState[P]>
} & {
  [x: string]: PropertyDescriptor
}

export class ObjectFreezeHandler extends FreezeHandler {
  public handle(
    aType: unknown,
    freezeServiceExecute: FreezeServiceExecuteCallback<unknown>,
  ): unknown {
    if (TypeCheck.isObject(aType)) {
      return this.freeze(
        this.freezeRecursively(
          CloneService.execute(aType),
          freezeServiceExecute,
        ),
      )
    }
    return this.handleNext(aType, freezeServiceExecute)
  }

  private freezeRecursively(
    aType: object,
    freezeServiceExecute: FreezeServiceExecuteCallback<unknown>,
  ) {
    const objectToFreeze: Record<string, unknown> = { ...aType }
    const descriptors = this.propertyDescriptorsOf(aType)
    for (const descriptor of Reflect.ownKeys(descriptors)) {
      this.isEligibleToAssign<typeof objectToFreeze>(descriptors, descriptor) &&
        (objectToFreeze[descriptor] = freezeServiceExecute(
          Reflect.get(objectToFreeze, descriptor),
        ))
    }
    return objectToFreeze
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

  private propertyDescriptorsOf<TBaseState>(aBaseState: TBaseState) {
    return Object.getOwnPropertyDescriptors(aBaseState)
  }
}
