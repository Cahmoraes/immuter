export class TypeCheck {
  static typeOf(aType: unknown): string {
    const typeString = Reflect.apply(Object.prototype.toString, aType, [])
    return typeString
      .slice(typeString.indexOf(' ') + 1, typeString.indexOf(']'))
      .toLowerCase()
  }

  static isDate(aType: unknown): aType is Date {
    return this.typeOf(aType) === 'date'
  }

  static isObject(aType: unknown): aType is object {
    return this.typeOf(aType) === 'object'
  }

  static isArray(aType: unknown): aType is unknown[] {
    return Array.isArray(aType)
  }

  static isMap(aType: unknown): aType is Map<unknown, unknown> {
    return this.typeOf(aType) === 'map'
  }

  static isSet(aType: unknown): aType is Set<unknown> {
    return this.typeOf(aType) === 'set'
  }

  static isPrimitive(aValue: unknown): aValue is object {
    return Object(aValue) !== aValue
  }
}
