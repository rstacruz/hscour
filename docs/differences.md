# Differences

#### forEach keys

`forEach()`: in arrays, the key will be strings instead of numbers.

```js
scour([1,2]).forEach(function (value, key) {
  typeof key === 'number'   // scour
  typeof key === 'string'   // hscour
})
```

