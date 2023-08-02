# Immuter

> A biblioteca Immuter fornece utilitários para trabalhar com dados imutáveis em JavaScript e TypeScript. Ela oferece métodos para criar cópias imutáveis de objetos e estruturas de dados complexas, permitindo modificar essas cópias sem afetar os dados originais.
>
> [![NPM Version][npm-image]][npm-url] > [![License][license-image]][license-url]

Com o Immuter, você pode:

- Produzir objetos imutáveis com base em um objeto de origem, aplicando modificações através de uma função de produtor, ex: `Immuter.produce`.
- Clonar objetos recursivamente de forma imutável, preservando a estrutura e os valores originais.
- Trabalhar com estruturas de dados complexas, como arrays, mapas, conjuntos e datas, mantendo a imutabilidade em todos os níveis, `Immuter.clone`.
- Por padrão, `Immuter.produce` e `Immuter.clone` geram clones recursivos e imutáveis com chamadas de `Object.freeze`, no entanto é possível desligar este comportamento globalmente ou por chamada. Isso pode ser feito por meio de uma interface amigável.
  - Para desligar: `Immuter.global.not.freeze()`.
  - Para ligar: `Immuter.global.freeze()`.
  - Para desligar o comportamento imutável para cada chamada método: `Immuter.not.freeze.clone` ou `Immuter.not.freeze.produce`. (Isto faz com que a imutabilidade seja desligada somente na chamada atual, as próximas serão imutáveis, a menos que seja desligado globalmente)

A abordagem imutável traz benefícios significativos para o desenvolvimento de software, como facilitar o rastreamento de alterações, evitar efeitos colaterais indesejados e simplificar o controle de estado em aplicações complexas.

A biblioteca Immuter é fácil de usar e pode ser integrada em projetos JavaScript e TypeScript. Ela fornece uma API intuitiva e flexível para criar e manipular dados imutáveis, oferecendo suporte para objetos, estruturas aninhadas e tipos de dados comuns.

## Instalação

```bash
npm install @cahmoraes93/immuter
```

## API

### Immuter

## Método `produce`

O método `produce` é uma função fornecida pela biblioteca Immuter para criar uma nova versão imutável de um objeto ou estrutura de dados complexa.

### Assinatura

```typescript
produce<T>(source: T, producer: (draft: Draft<T>) => void): T
```

### Parâmetros

- `source`: O objeto ou estrutura de dados base: (Object, Map, Array, Set, Date).
- `producer`: Uma função que recebe um rascunho (`draft`) do objeto de origem e permite realizar modificações nesse rascunho. Essas modificações são usadas para criar a nova versão imutável.

### Descrição

O método `produce` permite criar uma nova versão imutável de um objeto ou estrutura de dados complexa, enquanto mantém a semântica de imutabilidade e evita mutações indesejadas nos dados.

A função `producer` é chamada com um rascunho (`draft`) do objeto base de origem. Esse rascunho permite que você faça modificações como se estivesse trabalhando diretamente no objeto original. No entanto, o rascunho é uma cópia isolada e não afeta o objeto original.

```typescript
const source = {
  name: 'John',
  age: 30,
  hobbies: ['music'],
}

const nextState = Immuter.produce(source, (draft) => {
  draft.age = 31
  draft.hobbies.push('sport')
})

console.log(nextState) // { name: 'John', age: 31, hobbies: ['music', 'sport'] }
console.log(nextState === source) // false
```

Durante a execução da função `producer`, você pode modificar o rascunho livremente, aplicando as alterações necessárias. Todas as modificações feitas no rascunho são registradas e usadas para criar uma nova versão imutável do objeto.

O método `produce` é particularmente útil quando você precisa fazer modificações em objetos complexos, como objetos aninhados, arrays, mapas ou conjuntos, enquanto mantém a imutabilidade dos dados.

```typescript
const source = {
  name: 'John',
  address: {
    city: 'London',
    country: 'UK',
  },
}

const nextState = Immuter.produce(source, (draft) => {
  draft.address.city = 'Paris'
})

console.log(nextState) // { name: 'John', address: { city: 'Paris', country: 'UK' } }
console.log(nextState === source) // false
```

O método `produce` garante que a nova versão imutável seja criada de forma eficiente, aproveitando a estrutura do objeto original e aplicando apenas as alterações necessárias.

É possível configurar o método `produce` para não realizar a clonagem imutável do resultado. A API Immuter implementa o padrão Fluent API para fornecer uma interface amigável para configurar o comportamento do método `produce`.

```ts
const nextState = Immuter.not.freeze.produce(source, (draft) => {
  draft.address.city = 'Paris'
})

console.log(Object.isFrozen(nextState)) // false
```

## Método `clone`

O método `clone` é uma função auxiliar fornecida pela biblioteca Immuter para criar cópias imutáveis de objetos complexos, como objetos, arrays, mapas, conjuntos e datas.

### Assinatura

```typescript
clone<T>(source: T): T
```

### Parâmetros

- `source`: O objeto que será clonado.

### Descrição

O método `clone` retorna uma nova cópia imutável do objeto de origem. A cópia é uma réplica exata do objeto original, preservando a estrutura e os valores dos seus elementos. No entanto, a cópia gerada é imutável, o que significa que não é possível realizar modificações nos seus elementos após a criação.

```typescript
const source = {
  name: 'John',
  age: 30,
}

const clonedObject = Immuter.clone(source)

console.log(clonedObject) // { name: 'John', age: 30 }
console.log(clonedObject === source) // false
```

O método `clone` é útil quando você precisa criar cópias imutáveis de objetos para garantir a preservação dos dados originais e evitar mutações acidentais. Ele é particularmente útil em cenários onde a imutabilidade dos dados é crucial, como em aplicativos com arquiteturas baseadas em fluxo de dados unidirecional. Além disso, ao trabalhar com classes, toda a cadeia de protótipo é preservada no clone resultante.

É importante observar que o método `clone` realiza uma clonagem imutável e profunda de todos os objetos aninhados. Porém, é possível desligar o comportamento imutável utilizando `Immuter.not.clone`.

```typescript
const source = {
  name: 'John',
  address: {
    city: 'London',
    country: 'UK',
  },
}

const immutableClonedObject = Immuter.clone(source)
console.log(immutableClonedObject) // { name: 'John', address: { city: 'London', country: 'UK' } }
console.log(immutableClonedObject.address === source.address) // false
console.log(Object.isFrozen(immutableClonedObject.address)) // true

const clonedObject = Immuter.not.freeze.clone(source)
console.log(clonedObject) // { name: 'John', address: { city: 'London', country: 'UK' } }
console.log(clonedObject.address === source.address) // false
console.log(Object.isFrozen(clonedObject.address)) // false
```

O método `clone` facilita a criação de cópias imutáveis de objetos complexos, proporcionando um controle refinado sobre a imutabilidade dos dados em sua aplicação.

## Licença

Licença da biblioteca: MIT.

---

[//]: # 'Referências de links usados na seção de "Badges" e outras seções'
[npm-image]: https://img.shields.io/npm/v/minha-biblioteca.svg
[npm-url]: https://www.npmjs.com/package/@cahmoraes93/immuter
[license-image]: https://img.shields.io/badge/license-MIT-blue.svg
[license-url]: https://opensource.org/licenses/MIT
