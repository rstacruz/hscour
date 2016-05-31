# hscour

<!-- {.massive-header.-with-tagline} -->

> Traverse objects and arrays immutably

Scour is a general-purpose library for dealing with JSON trees.<br>
As a simple utility with a broad purpose, it can be used to solve many problems. Use it to:

- Manage your [Redux] datastore.
- Provide a model layer to access data in your single-page app. [→](#models)
- Navigate a large JSON tree easily.
- Rejoice in having a lightweight alternative to [Immutable.js]. ([Compare](docs/comparison.md))

hscour is a faster implementation of [scour](https://www.npmjs.com/package/scourjs) using HAMT trees.

[![Status](https://travis-ci.org/rstacruz/hscour.svg?branch=master)](https://travis-ci.org/rstacruz/hscour "See test builds")


## Features

Calling `scour(object)` returns a wrapper that you can use to traverse `object`.
Use [get()](#get) to retrieve values.

```js
data =
  { users:
    { 1: { name: 'john' },
      2: { name: 'shane', confirmed: true },
      3: { name: 'barry', confirmed: true } } }
```

```js
scour(data).get('users', '1', 'name')   // => 'john'
```

<br>

### Traversal
Use [go()](#go) to dig into the structure. It will return another `scour`
wrapper scoped to that object.

```js
data =
  { users:
    { admins:
      { bob: { logged_in: true },
        sue: { logged_in: false } } } }
```

```js
users  = scour(data).go('users')            // => [scour (admins)]
admins = scour(data).go('users', 'admins')  // => [scour (bob, sue)]

admins.go('bob').get('logged_in')           // => true
```

<br>

### Chaining

`scour()` provides a wrapper that can be used to chain methods. This is inspired by [Underscore] and [Lodash].

```js
scour(data)
  .go('users')
  .filter({ admin: true })
  .val()
```

[Underscore]: http://underscorejs.org/
[Lodash]: http://lodash.com/

<br>

### Immutable modifications

Use [set()](#set) to update values. Scout treats all data as immutable, so this
doesn't modify your original `data`, but gets you a new one with the
modifications made.

```js
data = scour(data)
  .set(['users', '1', 'updated_at'], +new Date())
  .val()

// => { users:
//      { 1: { name: 'john', updated_at: 1450667171188 },
//        2: { name: 'shane', confirmed: true },
//        3: { name: 'barry', confirmed: true } } }
```

<br>

### Advanced traversing

With the `indexed` extension, use [filter()] to filter results with advanced querying.

```js
users = scour(data).go('users')

users
  .filter({ confirmed: true })
  .at(0)
  .get('name')   // => 'shane'
```

<br>

### Models

With the `model` extension, you can add your own methods to certain keypaths. This makes them behave like models.<br>
See [a detailed example](docs/extensions_example.md) to learn more.

##### Sample data

<!-- {.file-heading} -->

```js
data =
  { artists:
    { 1: { first_name: 'Louie', last_name: 'Armstrong' },
      2: { first_name: 'Miles', last_name: 'Davis' } } }
```

##### Your models

<!-- {.file-heading} -->

```js
Root = {
  artists () { return this.go('artists') }
}

Artist = {
  fullname () {
    return this.get('first_name') + ' ' + this.get('last_name')
  }
}
```

##### Using with scour

<!-- {.file-heading} -->

```js
scour = scour.use(model, {
  '': Root,
  'artists.*': Artist
})

db = scour(data)
db.artists().find({ name: 'Miles' }).fullname()
//=> 'Miles Davis'
```

<br>

## Thanks

**hscour** © 2016+, Rico Sta. Cruz. Released under the [MIT] License.<br>
Authored and maintained by Rico Sta. Cruz with help from contributors ([list][contributors]).

> [ricostacruz.com](http://ricostacruz.com) &nbsp;&middot;&nbsp;
> GitHub [@rstacruz](https://github.com/rstacruz) &nbsp;&middot;&nbsp;
> Twitter [@rstacruz](https://twitter.com/rstacruz)

[MIT]: http://mit-license.org/
[contributors]: http://github.com/rstacruz/hscour/contributors
