export type CloneRecursively<Type> = (baseState: Type) => Type

export abstract class CloneHandler<Type = unknown> {
  private next?: CloneHandler<Type>

  constructor(aHandler?: CloneHandler<Type>) {
    this.next = aHandler
  }

  public abstract handle(
    aType: Type,
    cloneRecursively: CloneRecursively<Type>,
  ): Type

  protected handleNext(
    aType: Type,
    cloneRecursively: CloneRecursively<Type>,
  ): Type {
    if (this.next) {
      return this.next.handle(aType, cloneRecursively)
    }
    return aType
  }
}
