import { Immuter } from '../src'
import { CannotAssignToImmutableMapError } from '../src/immuter/shared/errors/cannot-assign-to-immutable-map-error'
import { CannotAssignToImmutableSetError } from '../src/immuter/shared/errors/cannot-assign-to-immutable-set-error'
import { CloneExceptionError } from '../src/immuter/shared/errors/clone-exception-error'

describe('Immuter test suite', () => {
  it('should clone basic object', () => {
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

  it('should clone basic object with getters and setters', () => {
    const myObject = {
      _name: 'caique',
      get name() {
        return this._name
      },
      set name(aValue) {
        this._name = aValue
      },
      getName() {
        return this.name
      },
    }

    const result = Immuter.produce(myObject, (draft) => {
      draft.name = 'thomas'
    })

    expect(result.name).toBe('thomas')
    expect(result.getName).toBeInstanceOf(Function)
    expect(result.getName()).toBe('thomas')
    expect(myObject.name).toBe('caique')
    expect(Object.getOwnPropertyDescriptor(result, 'name')?.get).toBeInstanceOf(
      Function,
    )
    expect(Object.getOwnPropertyDescriptor(result, 'name')?.set).toBeInstanceOf(
      Function,
    )
  })

  it('should clone object with nested properties', () => {
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

  it('should clone array', () => {
    const myArray = [1, 2, 3]
    const result = Immuter.produce(myArray, (draft) => {
      draft.push(4)
    })

    expect(myArray).toEqual([1, 2, 3])
    expect(result).toEqual([1, 2, 3, 4])
    expect(result).not.toBe(myArray)
  })

  it('should clone date', () => {
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

  it('should clone object recursively', () => {
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

  it('should clone map', () => {
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

  it('should clone set', () => {
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

    // Attempt to mutate nested information
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

  it('should produce a new array', () => {
    const myArray = [1, 2, 3]
    const nextState = Immuter.produce(myArray, (draft) => {
      draft.push(4)
    })
    expect(nextState).toHaveLength(4)
    expect(myArray).toHaveLength(3)
    expect(nextState).not.toBe(myArray)
  })

  it('should produce a new Map', () => {
    const myMap = new Map()
    const nextState = Immuter.produce(myMap, (draft) => {
      draft.set('name', 'caique')
    })

    expect(nextState).not.toBe(myMap)
    expect(nextState.has('name')).toBeTruthy()
    expect(myMap.has('name')).toBeFalsy()
  })

  it('should produce a new Set', () => {
    const mySet = new Set()
    const nextState = Immuter.produce(mySet, (draft) => {
      draft.add('caique')
    })

    expect(nextState).not.toBe(mySet)
    expect(nextState.has('caique')).toBeTruthy()
    expect(mySet.has('caique')).toBeFalsy()
  })

  it('should produce a new Date', () => {
    const aDate = new Date(2013, 6, 16)
    const nextState = Immuter.produce(aDate, (draft) => {
      draft.setDate(1)
    })

    expect(nextState).not.toBe(aDate)
    expect(nextState.getDate()).toEqual(1)
    expect(aDate.getDate()).toEqual(16)
  })

  describe('Immuter User Tests', () => {
    class Person {
      constructor(public name: string) {}
      greet() {
        return `Hello, my name is ${this.name}`
      }
    }

    class User extends Person {
      constructor(
        name: string,
        public age: number,
      ) {
        super(name)
      }

      celebrateBirthday() {
        this.age++
      }
    }

    describe('Immuter User Tests with Class and Superclass', () => {
      it('should produce a new User object preserving the prototype chain', () => {
        const user = new User('John', 30)

        const result = Immuter.produce(user, (draft) => {
          draft.age = 31
        })

        expect(result).toBeInstanceOf(User)
        expect(result).toBeInstanceOf(Person)
        expect(result).toEqual({ name: 'John', age: 31 })
        expect(user).toEqual({ name: 'John', age: 30 })
        expect(result.greet()).toBe('Hello, my name is John')
        expect(result).not.toBe(user)
        expect(result).toBeInstanceOf(Person)
        expect(result.greet()).toEqual(user.greet())
      })

      it('should clone a User object preserving the prototype chain', () => {
        const user = new User('John', 30)

        const clonedUser = Immuter.clone(user)

        expect(clonedUser).toBeInstanceOf(User)
        expect(clonedUser).toBeInstanceOf(Person)
        user.age = 31
        expect(clonedUser).toEqual({ name: 'John', age: 30 })
        expect(user).toEqual({ name: 'John', age: 31 })
        expect(clonedUser.greet()).toBe('Hello, my name is John')
        expect(clonedUser).not.toBe(user)
        expect(clonedUser).toBeInstanceOf(Person)
        expect(clonedUser.greet()).toEqual(user.greet())
      })
    })
  })

  describe('Immuter.produce not freeze', () => {
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
  })

  it('should clone data structures with immutability', () => {
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

  it('should clone data structures without immutability', () => {
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

  it('should clone Map', () => {
    const baseState = new Map<any, any>([
      ['name', 'John'],
      ['age', 30],
    ])

    const clonedState = Immuter.clone(baseState)

    expect(clonedState).toEqual(baseState)
    expect(clonedState).not.toBe(baseState)
    expect(Object.isFrozen(clonedState)).toBe(true)
    expect(() => clonedState.set('name', 'Martin')).toThrow(
      CannotAssignToImmutableMapError,
    )
    expect(clonedState.get('name')).toBe('John')
    expect(clonedState.get('age')).toBe(30)
  })

  it('should clone Set', () => {
    const baseState = new Set(['apple', 'banana', 'orange'])

    const clonedState = Immuter.clone(baseState)

    expect(clonedState).toEqual(baseState)
    expect(clonedState).not.toBe(baseState)
    expect(Object.isFrozen(clonedState)).toBe(true)
    expect(() => clonedState.add('grape')).toThrow(
      CannotAssignToImmutableSetError,
    )
    expect(clonedState.has('apple')).toBeTruthy()
    expect(clonedState.has('banana')).toBeTruthy()
    expect(clonedState.has('orange')).toBeTruthy()
    expect(clonedState.has('grape')).toBeFalsy()
  })

  it('should clone Date', () => {
    const baseState = new Date()

    const clonedState = Immuter.clone(baseState)

    expect(clonedState).toEqual(baseState)
    expect(clonedState).not.toBe(baseState)
    expect(Object.isFrozen(clonedState)).toBe(true)
  })

  it('should clone Array', () => {
    const baseState = [1, 2, 3]

    const clonedState = Immuter.clone(baseState)

    expect(clonedState).toEqual(baseState)
    expect(clonedState).not.toBe(baseState)
    expect(Object.isFrozen(clonedState)).toBe(true)
    expect(() => clonedState.push(4)).toThrow(TypeError)
    expect(clonedState.length).toBe(3)
  })

  describe('Immuter.clone not freeze', () => {
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
      clonedState.hobbies.add('random value')
      expect(clonedState.hobbies.has('random value')).toBeTruthy()

      // Assert maps are equal but not the same reference
      expect(clonedState.skills).toEqual(baseState.skills)
      expect(clonedState.skills).not.toBe(baseState.skills)
      expect(Object.isFrozen(clonedState.skills)).toBe(false)
      clonedState.skills.set('random', 10)
      expect(clonedState.skills.has('random')).toBeTruthy()

      // Assert arrays are equal but not the same reference
      expect(clonedState.flavors).toEqual(baseState.flavors)
      expect(clonedState.flavors).not.toBe(baseState.flavors)
      expect(Object.isFrozen(clonedState.flavors)).toBe(false)
      clonedState.flavors.push('random')
      expect(clonedState.flavors.includes('random')).toBeTruthy()
      clonedState.flavors.pop()
      expect(clonedState.flavors.includes('random')).toBeFalsy()
    })

    it('should clone Map', () => {
      const baseState = new Map<any, any>([
        ['name', 'John'],
        ['age', 30],
      ])

      const clonedState = Immuter.not.freeze.clone(baseState)

      expect(clonedState).toEqual(baseState)
      expect(clonedState).not.toBe(baseState)
      expect(Object.isFrozen(clonedState)).toBe(false)
      clonedState.set('name', 'Martin')
      expect(clonedState.get('name')).toBe('Martin')
      expect(clonedState.get('age')).toBe(30)
    })

    it('should clone Set', () => {
      const baseState = new Set(['apple', 'banana', 'orange'])

      const clonedState = Immuter.not.freeze.clone(baseState)

      expect(clonedState).toEqual(baseState)
      expect(clonedState).not.toBe(baseState)
      expect(Object.isFrozen(clonedState)).toBe(false)
      clonedState.add('grape')
      expect(clonedState.has('apple')).toBeTruthy()
      expect(clonedState.has('banana')).toBeTruthy()
      expect(clonedState.has('orange')).toBeTruthy()
      expect(clonedState.has('grape')).toBeTruthy()
    })

    it('should alternate between and Immuter.global.not.freeze() and Immuter.global.freeze()', () => {
      const baseState = {
        name: 'caique',
      }
      Immuter.global.freeze()
      const clonedState = Immuter.produce(baseState, (draft) => {
        draft.name = 'thomas'
      })
      const clonedState2 = Immuter.produce(baseState, (draft) => {
        draft.name = 'thomas'
      })
      const clonedState3 = Immuter.produce(baseState, (draft) => {
        draft.name = 'thomas'
      })
      const clonedState4 = Immuter.produce(baseState, (draft) => {
        draft.name = 'thomas'
      })
      expect(Object.isFrozen(clonedState)).toBeTruthy()
      expect(Object.isFrozen(clonedState2)).toBeTruthy()
      expect(Object.isFrozen(clonedState3)).toBeTruthy()
      expect(Object.isFrozen(clonedState4)).toBeTruthy()
      Immuter.global.not.freeze()
      const clonedState5 = Immuter.produce(baseState, (draft) => {
        draft.name = 'thomas'
      })
      const clonedState6 = Immuter.produce(baseState, (draft) => {
        draft.name = 'thomas'
      })
      expect(Object.isFrozen(clonedState5)).toBeFalsy()
      expect(Object.isFrozen(clonedState6)).toBeFalsy()

      Immuter.global.freeze()
      const clonedState7 = Immuter.not.freeze.produce(baseState, (draft) => {
        draft.name = 'thomas'
      })
      expect(Object.isFrozen(clonedState7)).toBe(false)

      Immuter.global.not.freeze()
      const clonedState8 = Immuter.not.freeze.produce(baseState, (draft) => {
        draft.name = 'thomas'
      })

      expect(Object.isFrozen(clonedState8)).toBe(false)

      Immuter.global.freeze()
      const clonedState9 = Immuter.produce(baseState, (draft) => {
        draft.name = 'thomas'
      })

      expect(Object.isFrozen(clonedState9)).toBe(true)

      const clonedState10 = Immuter.produce(baseState, (draft) => {
        draft.name = 'thomas'
      })
      expect(Object.isFrozen(clonedState10)).toBe(true)
    })

    it('example', () => {
      const baseState = {
        name: 'caique',
      }
      Immuter.global.freeze()
      const clonedState1 = Immuter.not.freeze.produce(baseState, (draft) => {
        draft.name = 'thomas'
      })

      expect(Object.isFrozen(clonedState1)).toBeFalsy()

      const clonedState2 = Immuter.produce(baseState, (draft) => {
        draft.name = 'thomas'
      })

      expect(Object.isFrozen(clonedState2)).toBeTruthy()

      Immuter.global.not.freeze()
      const clonedState3 = Immuter.produce(baseState, (draft) => {
        draft.name = 'thomas'
      })

      const clonedState4 = Immuter.produce(baseState, (draft) => {
        draft.name = 'thomas'
      })
    })

    it('should clone Date', () => {
      const baseState = new Date()

      const clonedState = Immuter.not.freeze.clone(baseState)

      expect(clonedState).toEqual(baseState)
      expect(clonedState).not.toBe(baseState)
      expect(Object.isFrozen(clonedState)).toBe(false)
    })

    it('should clone Array', () => {
      const baseState = [1, 2, 3]

      const clonedState = Immuter.not.freeze.clone(baseState)

      expect(clonedState).toEqual(baseState)
      expect(clonedState).not.toBe(baseState)
      expect(Object.isFrozen(clonedState)).toBe(false)
      clonedState.push(4)
      expect(clonedState.length).toBe(4)
    })
  })

  describe('Immuter.global', () => {
    it('should not freeze when execute Immuter.global.not.freeze', () => {
      Immuter.global.not.freeze()
      const source = {
        name: 'John',
        address: {
          city: 'London',
          country: 'UK',
        },
      }

      const nextState = Immuter.produce(source, (draftState) => {
        draftState.name = 'caique'
        draftState.address.city = 'São Paulo'
      })

      const nextState2 = Immuter.produce(nextState, (draftState) => {
        draftState.name = 'igor'
        draftState.address.city = 'Tokyo'
      })

      expect(nextState.name).toBe('caique')
      expect(nextState.address.city).toBe('São Paulo')
      expect(nextState2.name).toBe('igor')
      expect(nextState2.address.city).toBe('Tokyo')
    })

    it('should freeze when execute Immuter.global.freeze()', () => {
      Immuter.global.not.freeze()
      const source = {
        name: 'John',
        address: {
          city: 'London',
          country: 'UK',
        },
      }

      const nextState = Immuter.produce(source, (draftState) => {
        draftState.name = 'caique'
        draftState.address.city = 'São Paulo'
      })

      const nextState2 = Immuter.produce(nextState, (draftState) => {
        draftState.name = 'igor'
        draftState.address.city = 'Tokyo'
      })

      expect(nextState.name).toBe('caique')
      expect(nextState.address.city).toBe('São Paulo')
      expect(nextState2.name).toBe('igor')
      expect(nextState2.address.city).toBe('Tokyo')

      Immuter.global.freeze()

      const nextState3 = Immuter.produce(nextState2, (draftState) => {
        draftState.name = 'isabella'
        draftState.address.city = 'San Francisco'
      })

      expect(() => (nextState3.address.city = 'any city')).toThrow(TypeError)
      expect(() => (nextState3.name = 'any name')).toThrow(TypeError)

      Immuter.global.not.freeze()
      // Immuter.global.freeze()

      const nextState4 = Immuter.produce(nextState, (draftState) => {
        draftState.name = 'bolt'
        draftState.address.city = 'Miami'
      })

      nextState4.name = 'bob'
      expect(nextState4.name).toBe('bob')

      Immuter.global.freeze()
      expect(() =>
        Immuter.produce(nextState3, (draftState) => {
          draftState.name = 'any name'
        }),
      ).toThrow(CloneExceptionError)
    })
  })
})
