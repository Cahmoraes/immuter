export class TypeCheck {
  private static check(aType: unknown): string {
    const typeString = Reflect.apply(Object.prototype.toString, aType, [])
    return typeString
      .slice(typeString.indexOf(' ') + 1, typeString.indexOf(']'))
      .toLowerCase()
  }

  static isDate(aType: unknown): aType is Date {
    return this.check(aType) === 'date'
  }

  static isObject(aType: unknown): aType is object {
    return this.check(aType) === 'object'
  }

  static isArray(aType: unknown): aType is unknown[] {
    return Array.isArray(aType)
  }

  static isMap(aType: unknown): aType is Map<unknown, unknown> {
    return this.check(aType) === 'map'
  }

  static isSet(aType: unknown): aType is Set<unknown> {
    return this.check(aType) === 'set'
  }
}
