# SUI

## Introduction

SUI is a javascript framework made with vue 3. it's written by typescript and has type references

## Getting started

> [!NOTE]
> before installation you need proper github token. because it's a private repository

install

```
yarn add -D @khsura/sui
```

```ts
const { createApp } from 'vue'
const { createSUI } from '@khsura/sui'
const App from './App.vue'

const app = createApp(App)

app.use(createSUI())

app.mount('#app')
```
