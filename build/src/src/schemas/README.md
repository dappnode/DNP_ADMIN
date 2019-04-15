# Schemas

## Basic use

```js
import Joi from "joi";

const basicSchema = Joi.object({
  name: Joi.string().required()
});
const result = Joi.validate({ name: "name", name2: 1 }, basicSchema);
result = {};
```

## How to use nested schemas

```js
const superSchema = Joi.object({
  key: Joi.string().required(),
  nestedSchema: basicSchema.required()
});

const result = Joi.validate(
  { key: "value", nestedSchema: { name: "name", name2: 1 } },
  resultSchema
);
console.log(result);
```

## How to match object values

Note that this is not expected JSON behaviour. For a list of data, like diagnoses, one should use an array with IDs. Then, if redux prefers objects convert it to one.

```js
const schema = Joi.object({}).pattern(/.*/, basicSchema);
const validValue = {
  "random key": { name: "name" }
};
```
