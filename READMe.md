# Immuter

> A biblioteca Immuter fornece utilitários para trabalhar com dados imutáveis em JavaScript e TypeScript. Ela oferece métodos para criar cópias imutáveis de objetos e estruturas de dados complexas, permitindo modificar essas cópias sem afetar os dados originais.
>
> [![NPM Version][npm-image]][npm-url] > [![License][license-image]][license-url]

Com o Immuter, você pode:

- Produzir objetos imutáveis com base em um objeto de origem, aplicando modificações através de uma função de produtor.
- Clonar objetos de forma imutável, preservando a estrutura e os valores originais.
- Trabalhar com estruturas de dados complexas, como arrays, mapas, conjuntos e datas, mantendo a imutabilidade em todos os níveis.

A abordagem imutável traz benefícios significativos para o desenvolvimento de software, como facilitar o rastreamento de alterações, evitar efeitos colaterais indesejados e simplificar o controle de estado em aplicações complexas.

A biblioteca Immuter é fácil de usar e pode ser integrada em projetos JavaScript e TypeScript. Ela fornece uma API intuitiva e flexível para criar e manipular dados imutáveis, oferecendo suporte para objetos, estruturas aninhadas e tipos de dados comuns.

## Instalação

```bash
npm install @cahmoraes93/immuter
```

## Uso

Aqui você pode fornecer exemplos de código para mostrar como usar sua biblioteca.

```typescript
import { Immuter } from '@cahmoraes93/immuter'

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

## Método `produce`

O método `produce` é uma função fornecida pela biblioteca Immuter para criar uma nova versão imutável de um objeto ou estrutura de dados complexa.

### Assinatura

```typescript
produce<T>(source: T, producer: (draft: Draft<T>) => void): T
```

### Parâmetros

- `source`: O objeto ou estrutura de dados a ser produzido.
- `producer`: Uma função que recebe um rascunho (`draft`) do objeto de origem e permite realizar modificações nesse rascunho. Essas modificações são usadas para criar a nova versão imutável.

### Descrição

O método `produce` permite criar uma nova versão imutável de um objeto ou estrutura de dados complexa, enquanto mantém a semântica de imutabilidade e evita mutações indesejadas nos dados.

A função `producer` é chamada com um rascunho (`draft`) do objeto de origem. Esse rascunho permite que você faça modificações como se estivesse trabalhando diretamente no objeto original. No entanto, o rascunho é uma cópia isolada e não afeta o objeto original.

```typescript
const source = {
  name: 'John',
  age: 30,
}

const nextState = Immuter.produce(source, (draft) => {
  draft.age = 31
})

console.log(nextState) // { name: 'John', age: 31 }
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

O método `produce` garante que a nova versão imutável seja criada de forma eficiente, aproveitando a estrutura do objeto original e aplicando apenas as alterações necessárias. Isso resulta em um desempenho otimizado e evita a criação desnecessária de cópias completas dos objetos.

O método `produce` permite trabalhar com estruturas de dados complexas de forma declarativa e expressiva, facilitando a manutenção da imutabilidade e a criação de cópias consistentes dos dados em sua aplicação.

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

O método `clone` é útil quando você precisa criar cópias imutáveis de objetos para garantir a preservação dos dados originais e evitar mutações acidentais. Ele é particularmente útil em cenários onde a imutabilidade dos dados é crucial, como em aplicativos com arquiteturas baseadas em fluxo de dados unidirecional.

É importante observar que o método `clone` não realiza uma clonagem profunda automática de objetos aninhados. Para objetos aninhados, você pode usar o método `produce` em conjunto com o `clone` para obter cópias imutáveis profundas.

```typescript
const source = {
  name: 'John',
  address: {
    city: 'London',
    country: 'UK',
  },
}

const clonedObject = Immuter.produce(source, (draft) => {
  draft.address = Immuter.clone(draft.address)
})

console.log(clonedObject) // { name: 'John', address: { city: 'London', country: 'UK' } }
console.log(clonedObject.address === source.address) // false
```

O método `clone` facilita a criação de cópias imutáveis de objetos complexos, proporcionando um controle refinado sobre a imutabilidade dos dados em sua aplicação.

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
