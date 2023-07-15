import { Immuter } from '../src'

describe('Immuter test suite', () => {
  it('should return a valid object', () => {
    const myObject = {
      name: 'caique',
    }

    const result = Immuter.produce(myObject, (draft) => {
      draft.name = 'thomas'
    })

    expect(result).toEqual({ name: 'caique' })
  })

  it('should create a deep clone of an object', () => {
    const myObject = {
      name: 'caique',
    }

    const result = Immuter.produce(myObject, (draft) => {
      draft.name = 'thomas'
    })

    expect(myObject.name).toBe('caique')
    expect(result.name).toBe('caique')
    expect(result).not.toBe(myObject)
  })

  it('should clone a Date', () => {
    const aDate = new Date()
    const result = Immuter.produce(aDate, (draft) => {
      draft = new Date()
    })
    expect(result).toBeInstanceOf(Date)
    expect(result).not.toBe(aDate)
  })

  it('should clone an array', () => {
    const myArray = [1, 2, 3]
    const result = Immuter.produce(myArray, (draft) => {
      draft.push(4)
    })
    expect(result).toEqual([1, 2, 3])
  })

  it('should clone recursively an object', () => {
    const myObject = {
      name: 'caique',
      address: {
        street: 'street',
        city: 'city',
      },
    }

    const result = Immuter.produce(myObject, (draft) => {
      draft.name = 'thomas'
    })

    expect(myObject.name).toBe('caique')
    expect(result.name).toBe('caique')
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
    })

    expect(myObject.name).toBe('caique')
    expect(result.name).toBe('caique')
    expect(result).not.toBe(myObject)
    expect(result.info.hobbies).not.toBe(myObject.info.hobbies)
    expect(result.info.hobbies[0]).not.toBe(myObject.info.hobbies[0])
    myObject.info.hobbies[0][0].name = 'sport'
    expect(myObject.info.hobbies[0][0].name).toBe('sport')
    expect(result.info.hobbies[0][0].name).toBe('gym')
  })

  it('should clone recursively a Map', () => {
    const myObject = {
      map: new Map([['name', 'caique']]),
    }

    const result = Immuter.produce(myObject, (draft) => {
      draft.map.set('name', 'thomas')
    })

    expect(myObject.map.get('name')).toBe('caique')
    expect(result.map.get('name')).toBe('caique')
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
  })
})
