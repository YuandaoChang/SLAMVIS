# SLAMVIS

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

```
SLAMVIS
├─ .gitignore
├─ README.md
├─ index.html
├─ package-lock.json
├─ package.json
├─ public
│  └─ favicon.ico
├─ src
│  ├─ App.vue
│  ├─ assets
│  │  └─ global.css
│  ├─ main.js
│  ├─ webworker
│  │  ├─ dataWorker.js
│  │  └─ temporary.vue
│  └─ world
│     ├─ compoenets
│     │  ├─ camera.js
│     │  ├─ light.js
│     │  └─ scene.js
│     ├─ systems
│     │  ├─ controls.js
│     │  ├─ renderer.js
│     │  └─ resizer.js
│     └─ world.js
└─ vite.config.js

```