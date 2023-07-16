export type FreezeServiceExecuteCallback<Type> = (baseState: Type) => Type

export abstract class FreezeHandler<Type = unknown> {
  private next?: FreezeHandler<Type>

  constructor(aHandler?: FreezeHandler<Type>) {
    this.next = aHandler
  }

  public abstract handle(
    aType: Type,
    freezeServiceExecute: FreezeServiceExecuteCallback<Type>,
  ): Type

  protected handleNext(
    aType: Type,
    cloneRecursively: FreezeServiceExecuteCallback<Type>,
  ): Type {
    if (this.next) {
      return this.next.handle(aType, cloneRecursively)
    }
    return aType
  }

  protected freeze(aType: Type): Readonly<Type> {
    return Object.freeze(aType)
  }
}
