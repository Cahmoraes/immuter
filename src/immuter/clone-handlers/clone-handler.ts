export type CloneServiceExecuteCallback<Type> = (baseState: Type) => Type

export abstract class CloneHandler<Type = unknown> {
  private next?: CloneHandler<Type>

  constructor(aHandler?: CloneHandler<Type>) {
    this.next = aHandler
  }

  public abstract handle(
    aType: Type,
    cloneServiceExecute: CloneServiceExecuteCallback<Type>,
  ): Type

  protected handleNext(
    aType: Type,
    cloneRecursively: CloneServiceExecuteCallback<Type>,
  ): Type {
    if (this.next) {
      return this.next.handle(aType, cloneRecursively)
    }
    return aType
  }
}
