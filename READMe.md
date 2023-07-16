# Nome da Biblioteca

> Descrição breve da biblioteca

[![NPM Version][npm-image]][npm-url]
[![License][license-image]][license-url]

Breve descrição da biblioteca e sua funcionalidade principal.

## Instalação

```bash
npm install minha-biblioteca
```

## Uso

Aqui você pode fornecer exemplos de código para mostrar como usar sua biblioteca.

```typescript
import { Immuter } from 'minha-biblioteca'

const myObject = {
  name: 'John',
  age: 30,
}

const result = Immuter.produce(myObject, (draft) => {
  draft.age = 31
})

console.log(result) // Output: { name: 'John', age: 31 }
```

## API

### Immuter

#### `produce<T>(source: T, producer: (draft: Draft<T>) => void): T`

Descrição breve do método e sua funcionalidade.

- `source`: A fonte de dados original.
- `producer`: Uma função que recebe um rascunho (`draft`) como argumento e faz modificações nele.

Retorna uma nova cópia do objeto original com as modificações aplicadas.

#### `clone<T>(source: T): T`

Descrição breve do método e sua funcionalidade.

- `source`: A fonte de dados original.

Retorna uma cópia imutável do objeto original.

#### `not.freeze`

Uma propriedade que pode ser usada para evitar o congelamento dos objetos clonados.

Exemplo de uso:

```typescript
const baseState = {
  name: 'John',
  age: 30,
}

const clonedState = Immuter.not.freeze.clone(baseState)

console.log(Object.isFrozen(clonedState)) // Output: false
```

## Licença

Licença da biblioteca (por exemplo, MIT, Apache-2.0, etc).

---

## Contribuição

Aqui você pode fornecer informações sobre como os usuários podem contribuir para o projeto, como reportar problemas, abrir solicitações de melhorias, etc.

1. Faça um Fork do projeto
2. Crie uma Branch para sua Feature (`git checkout -b feature/MinhaFeature`)
3. Faça commit de suas alterações (`git commit -am 'Adicionei uma nova funcionalidade'`)
4. Faça o Push para a Branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

---

[//]: # 'Referências de links usados na seção de "Badges" e outras seções'
[npm-image]: https://img.shields.io/npm/v/minha-biblioteca.svg
[npm-url]: https://www.npmjs.com/package/minha-biblioteca
[license-image]: https://img.shields.io/badge/license-MIT-blue.svg
[license-url]: https://opensource.org/licenses/MIT
