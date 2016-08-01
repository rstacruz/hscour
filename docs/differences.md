# Differences

#### Data

`data` is now a method and it returns a HAMT tree. Hscour's `valueOf()` is what corresponds to Scour's `data`.

```js
// scour
let obj = scour({ name: 'john' })
obj.data // => { name: 'john' }
```

```js
// hscour
let obj = scour({ name: 'john' })
obj.valueOf() // => { name: 'john' }
obj.data // => (hamt tree)
```

#### forEach keys

`forEach()`: in arrays, the key will be strings instead of numbers.

```js
hscour([1,2]).forEach(function (value, key) {
  typeof key === 'number'   // scour
  typeof key === 'string'   // hscour
})
```

