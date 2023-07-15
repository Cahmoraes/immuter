import { Immuter } from '../src'

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
})
