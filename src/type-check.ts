export class TypeCheck {
  static execute(aType: unknown): string {
    const typeString = Reflect.apply(Object.prototype.toString, aType, [])
    return typeString
      .slice(typeString.indexOf(' ') + 1, typeString.indexOf(']'))
      .toLowerCase()
  }

  static isDate(aType: unknown): aType is Date {
    return this.execute(aType) === 'date'
  }

  static isObject(aType: unknown): aType is object {
    return this.execute(aType) === 'object'
  }

  static isArray(aType: unknown): aType is unknown[] {
    return Array.isArray(aType)
  }
}
