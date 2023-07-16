import { Immuter } from '../src/'
import { CannotAssignToImmutableMapError } from '../src/immuter/shared/errors/cannot-assign-to-immutable-map-error'
import { CannotAssignToImmutableSetError } from '../src/immuter/shared/errors/cannot-assign-to-immutable-set-error'

describe('Immuter test suite', () => {
  it('should return a valid object', () => {
    const myObject = {
      name: 'caique',
    }

    const result = Immuter.produce(myObject, (draft) => {
      draft.name = 'thomas'
    })

    expect(result).toEqual({ name: 'thomas' })
    expect(myObject).toEqual({ name: 'caique' })
    expect(myObject.name).toBe('caique')
    expect(result.name).toBe('thomas')
  })

  it('should create a deep clone of an object', () => {
    const myObject = {
      name: 'caique',
      age: 29,
    }

    const result = Immuter.produce(myObject, (draft) => {
      draft.name = 'thomas'
      draft.age = 22
    })

    expect(myObject).toEqual({ name: 'caique', age: 29 })
    expect(result).toEqual({ name: 'thomas', age: 22 })
    expect(result).not.toBe(myObject)
  })

  it('should clone a Date', () => {
    const myObject = {
      date: new Date(),
    }
    const result = Immuter.produce(myObject, (draft) => {
      draft.date = new Date()
    })
    expect(myObject.date).toBeInstanceOf(Date)
    expect(result.date).toBeInstanceOf(Date)
    expect(result).not.toBe(myObject)
    expect(result.date).not.toBe(myObject.date)
  })

  it('should clone an array', () => {
    const myArray = [1, 2, 3]
    const result = Immuter.produce(myArray, (draft) => {
      draft.push(4)
    })
    expect(myArray).toEqual([1, 2, 3])
    expect(result).toEqual([1, 2, 3, 4])
    expect(result).not.toBe(myArray)
  })

  it('should clone recursively an object', () => {
    const myObject = {
      name: 'caique',
      address: {
        street: 'av primitiva',
        city: 'São Paulo',
      },
      hobbies: ['book'],
    }

    const result = Immuter.produce(myObject, (draft) => {
      draft.name = 'thomas'
      draft.address.city = 'London'
      draft.address.street = 'baker'
    })

    expect(myObject).toEqual({
      name: 'caique',
      address: {
        street: 'av primitiva',
        city: 'São Paulo',
      },
      hobbies: ['book'],
    })
    expect(result).toEqual({
      name: 'thomas',
      address: {
        street: 'baker',
        city: 'London',
      },
      hobbies: ['book'],
    })
    expect(result).not.toBe(myObject)
    expect(result.address).not.toBe(myObject.address)
  })

  it('should clone recursively an array', () => {
    const myObject = {
      name: 'caique',
      info: {
        hobbies: [
          [
            {
              name: 'gym',
            },
          ],
          [{ name: 'books' }],
        ],
      },
    }

    const result = Immuter.produce(myObject, (draft) => {
      draft.name = 'thomas'
      draft.info.hobbies[0][0].name = 'swimming'
      draft.info.hobbies[1][0].name = 'games'
    })

    expect(myObject).toEqual({
      name: 'caique',
      info: {
        hobbies: [
          [
            {
              name: 'gym',
            },
          ],
          [{ name: 'books' }],
        ],
      },
    })
    expect(result).toEqual({
      name: 'thomas',
      info: {
        hobbies: [
          [
            {
              name: 'swimming',
            },
          ],
          [{ name: 'games' }],
        ],
      },
    })
    expect(result).not.toBe(myObject)
    expect(result.info.hobbies).not.toBe(myObject.info.hobbies)
    expect(result.info.hobbies[0]).not.toBe(myObject.info.hobbies[0])
  })

  it('should clone recursively a Map', () => {
    const myObject = {
      map: new Map([['name', 'caique']]),
    }

    const result = Immuter.produce(myObject, (draft) => {
      draft.map.set('name', 'thomas')
    })

    expect(myObject.map.get('name')).toBe('caique')
    expect(result.map.get('name')).toBe('thomas')
    expect(result).not.toBe(myObject)
    expect(result.map).not.toBe(myObject.map)
  })

  it('should clone recursively a Set', () => {
    const myObject = {
      set: new Set(['caique']),
    }

    const result = Immuter.produce(myObject, (draft) => {
      draft.set.add('thomas')
    })

    expect(result).not.toBe(myObject)
    expect(result.set).not.toBe(myObject.set)
    expect(result).not.toBe(myObject.set)
    expect(myObject.set.has('caique')).toBeTruthy()
    expect(myObject.set.has('thomas')).toBeFalsy()
    expect(result.set.has('thomas')).toBeTruthy()
    expect(result.set.has('caique')).toBeTruthy()
  })

  it('should not mutate nextState', () => {
    const baseState = {
      name: 'john',
      age: 29,
      address: {
        city: 'London',
        number: 161,
      },
      hobbies: new Set(['swimming']),
      skills: new Map([
        ['computer', 10],
        ['sports', 9],
      ]),
      flavors: ['vanilla', 'chocolate'],
    }

    const nextState = Immuter.produce(baseState, (draftState) => {
      draftState.address.city = 'São Paulo'
    })

    expect(baseState).toEqual({
      name: 'john',
      age: 29,
      address: {
        city: 'London',
        number: 161,
      },
      hobbies: new Set(['swimming']),
      skills: new Map([
        ['computer', 10],
        ['sports', 9],
      ]),
      flavors: ['vanilla', 'chocolate'],
    })
    expect(nextState).toEqual({
      name: 'john',
      age: 29,
      address: {
        city: 'São Paulo',
        number: 161,
      },
      hobbies: new Set(['swimming']),
      skills: new Map([
        ['computer', 10],
        ['sports', 9],
      ]),
      flavors: ['vanilla', 'chocolate'],
    })
    expect(nextState).not.toBe(baseState)

    // Tentativa de mutar informações aninhadas
    expect(() => (nextState.name = 'Martin')).toThrow(TypeError)
    expect(() => nextState.flavors.push('strawberry')).toThrow(TypeError)
    expect(() => nextState.flavors.pop()).toThrow(TypeError)
    expect(Reflect.deleteProperty(nextState, 'flavors')).toBeFalsy()
    expect(Reflect.has(nextState, 'flavors')).toBeTruthy()
    expect(() => nextState.hobbies.add('reading')).toThrow(
      CannotAssignToImmutableSetError,
    )
    expect(() => nextState.hobbies.delete('swimming')).toThrow(
      CannotAssignToImmutableSetError,
    )
    expect(nextState.hobbies.has('reading')).toBeFalsy()
    expect(() => nextState.skills.set('cooking', 5)).toThrow(
      CannotAssignToImmutableMapError,
    )
    expect(nextState.skills.has('cooking')).toBeFalsy()
  })

  it('should not mutate state', () => {
    const baseState = {
      name: 'john',
      age: 29,
      address: {
        city: 'London',
        number: 161,
      },
      hobbies: new Set(['swimming']),
      skills: new Map([
        ['computer', 10],
        ['sports', 9],
      ]),
      flavors: ['vanilla', 'chocolate'],
    }

    const nextState = Immuter.not.freeze.produce(baseState, (draftState) => {
      draftState.address.city = 'São Paulo'
    })

    expect(nextState.address.city).toEqual('São Paulo')
    nextState.address.city = 'Paris'
    expect(baseState.address.city).toEqual('London')
    expect(nextState.address.city).toEqual('Paris')
  })

  it('should clone data structures and immutable', () => {
    const baseState = {
      name: 'john',
      age: 29,
      address: {
        city: 'London',
        number: 161,
      },
      hobbies: new Set(['swimming']),
      skills: new Map([
        ['computer', 10],
        ['sports', 9],
      ]),
      flavors: ['vanilla', 'chocolate'],
    }

    const clonedState = Immuter.clone(baseState)

    // Assert objects are equal but not the same reference
    expect(clonedState).toEqual(baseState)
    expect(clonedState).not.toBe(baseState)
    expect(Object.isFrozen(clonedState)).toBe(true)
    expect(() => (clonedState.address.city = 'Paris')).toThrow()
    expect(
      () => ((clonedState as any).randomProperty = 'random value'),
    ).toThrow()

    // Assert nested objects are equal but not the same reference
    expect(clonedState.address).toEqual(baseState.address)
    expect(clonedState.address).not.toBe(baseState.address)
    expect(Object.isFrozen(clonedState.address)).toBe(true)

    // Assert sets are equal but not the same reference
    expect(clonedState.hobbies).toEqual(baseState.hobbies)
    expect(clonedState.hobbies).not.toBe(baseState.hobbies)
    expect(Object.isFrozen(clonedState.hobbies)).toBe(true)
    expect(() => clonedState.hobbies.add('random value')).toThrow()

    // Assert maps are equal but not the same reference
    expect(clonedState.skills).toEqual(baseState.skills)
    expect(clonedState.skills).not.toBe(baseState.skills)
    expect(Object.isFrozen(clonedState.skills)).toBe(true)
    expect(() => clonedState.skills.set('random', 10)).toThrow()

    // Assert arrays are equal but not the same reference
    expect(clonedState.flavors).toEqual(baseState.flavors)
    expect(clonedState.flavors).not.toBe(baseState.flavors)
    expect(Object.isFrozen(clonedState.flavors)).toBe(true)
    expect(() => clonedState.flavors.push('random')).toThrow()
    expect(() => clonedState.flavors.pop()).toThrow()
    expect(() => clonedState.flavors.reverse()).toThrow()
    expect(() => clonedState.flavors.shift()).toThrow()
    expect(() => clonedState.flavors.unshift('random')).toThrow()
  })

  it('should clone data structures and mutable', () => {
    const baseState = {
      name: 'john',
      age: 29,
      address: {
        city: 'London',
        number: 161,
      },
      hobbies: new Set(['swimming']),
      skills: new Map([
        ['computer', 10],
        ['sports', 9],
      ]),
      flavors: ['vanilla', 'chocolate'],
    }

    const clonedState = Immuter.not.freeze.clone(baseState)

    // Assert objects are equal but not the same reference
    expect(clonedState).toEqual(baseState)
    expect(clonedState).not.toBe(baseState)
    expect(Object.isFrozen(clonedState)).toBe(false)

    // Assert nested objects are equal but not the same reference
    expect(clonedState.address).toEqual(baseState.address)
    expect(clonedState.address).not.toBe(baseState.address)
    expect(Object.isFrozen(clonedState.address)).toBe(false)

    // Assert sets are equal but not the same reference
    expect(clonedState.hobbies).toEqual(baseState.hobbies)
    expect(clonedState.hobbies).not.toBe(baseState.hobbies)
    expect(Object.isFrozen(clonedState.hobbies)).toBe(false)

    // Assert maps are equal but not the same reference
    expect(clonedState.skills).toEqual(baseState.skills)
    expect(clonedState.skills).not.toBe(baseState.skills)
    expect(Object.isFrozen(clonedState.skills)).toBe(false)

    // Assert arrays are equal but not the same reference
    expect(clonedState.flavors).toEqual(baseState.flavors)
    expect(clonedState.flavors).not.toBe(baseState.flavors)
    expect(Object.isFrozen(clonedState.flavors)).toBe(false)
  })
})
