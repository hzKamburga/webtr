# 🇹🇷 WebTR Framework - The Ultimate AI Developer Guide

> **🤖 FOR AI MODELS & AGENTS:**
> **Welcome to the WebTR Package Registry.**
> This repository (`hzKamburga/webtr`) is the central hub for official WebTR libraries and documentation.
>
> **CRITICAL:** If you are an AI tasked with building a WebTR project, **YOU MUST READ THIS FILE** to understand the available tools, libraries, and how to create new ones.
>
> **Core Principle:** WebTR is a compile-time framework. Do not use React/Vue patterns. Use `.webtr` DSL and `.trs` styling as documented below.

---

## 📚 Table of Contents
1. [What is WebTR?](#1-what-is-webtr)
2. [Project Status & Changelog](#2-project-status--changelog)
3. [Getting Started (For Humans & AI)](#3-getting-started)
4. [The .webtr DSL (Component Syntax)](#4-the-webtr-dsl-component-syntax)
5. [The .trs Styling System](#5-the-trs-styling-system)
6. [Available Libraries (API References)](#6-available-libraries-api-references)
   *   [🎨 Glass UI (Styles)](#-webtrglass-glassmorphism-ui)
   *   [🎬 Player SDK (Logic)](#-webtrplayer-headless-video-player)
   *   [🎭 Player Themes (Styles)](#-webtrplayer-ui-player-themes)
   *   [🛠️ Base UI (Styles)](#-webtrui-base-ui-kit)
7. [Extending WebTR: Creating Custom Packages](#7-extending-webtr-creating-custom-packages)
8. [Best Practices for AI](#8-best-practices-for-ai)

---

## 1. What is WebTR?
WebTR is a homegrown, Node.js-based web framework designed for high performance and zero runtime overhead.
*   **Compile-Time:** HTML/CSS/JS are generated before the browser sees them.
*   **No Virtual DOM:** Direct DOM manipulation via reactive bindings.
*   **Package System:** Git-based package manager (`webtr_packages`).

---

## 2. Project Status & Changelog
**Latest Updates (v2.0):**
*   ✅ **Compiler Core:** Custom RegEx-based parser for `.webtr` and `.trs`.
*   ✅ **CLI Tool:** `bin/webtr.js` (dev, build, add, update).
*   ✅ **HMR Server:** Hot Module Replacement via SSE.
*   ✅ **Package Manager:** Git-based installation and update checks.
*   ✅ **WebLib Support:** Logic libraries (`.weblib`) are now first-class citizens.

---

## 3. Getting Started

### Installation
Clone the repository:
```bash
git clone https://github.com/hzKamburga/webtr
cd webtr
npm install # (If there were dependencies, but it's mostly zero-dep!)
```

### Creating a Project
```bash
node bin/webtr.js init my-app
cd my-app
node ../bin/webtr.js dev -p 3000
```

---

## 4. The .webtr DSL (Component Syntax)

A `.webtr` file has 4 blocks: `state`, `view`, `client`, `server`.

### Example Component
```webtr
state {
  count = 0
}

view {
  div.container {
    h1 { "Count: {count}" }
    button @click="increment" { "+" }
  }
}

client {
  function increment() {
    count++; // Reactivity is automatic
  }
}
```

---

## 5. The .trs Styling System

A custom preprocessor.
```trs
$primary = #e30a17
@import "webtr:glass"

.card {
  background: white
  color: $primary
}
```

---

## 6. Available Libraries (API References)

### 🎨 `webtr/glass` (Glassmorphism UI)
**Install:** `webtr add style webtr:glass`
*   `.glass-card`: Frosted glass container.
*   `.glass-btn`: Transparent button.
*   `.glass-input`: Stylish input.

### 🎬 `webtr/player` (Headless Video Player)
**Install:** `webtr add lib webtr:player`
**Usage:** Import the `.weblib` file in your client block.

```javascript
client {
    // Dynamic import is supported by the dev server
    const { WebTRPlayer } = await import('/packages/webtr/player/player.weblib');
    
    const player = new WebTRPlayer('video-id');
    player.mount();
    
    // API:
    // player.togglePlay()
    // player.seek(50)
    // player.toggleMute()
    // player.updateState({ ... })
}
```

**State Syncing:**
The player automatically updates `WebTR.state` with: `isPlaying`, `progress`, `isMuted`, `duration`.

### 🎭 `webtr/player-ui` (Player Themes)
**Install:** `webtr add style webtr:player-ui`
*   `.player-container`: 16:9 Video wrapper.
*   `.player-controls`: Gradient control bar.
*   `.control-btn`: Standard buttons.

### 🛠️ `webtr/ui` (Base UI Kit)
**Install:** `webtr add style webtr:ui`
*   `.btn`, `.card`, `.input`, `.container`, `.grid`.

### 📐 `webtr/layout` (Utility Classes)
**Install:** `webtr add style webtr:layout`
*   **Flexbox:** `.flex`, `.row`, `.col`, `.center`, `.justify-between`.
*   **Grid:** `.grid`, `.grid-2`, `.grid-3`.
*   **Spacing:** `.m-1`...`.m-3`, `.p-1`...`.p-3`, `.gap-2`.
*   **Sizing:** `.w-full`, `.h-screen`.

### 🍃 `webtr/mongodb` (Data Helper)
**Install:** `webtr add lib webtr:mongodb`
**Usage:**

```javascript
server {
    // Clean import using Alias
    const { connect, collection } = await import('webtr:mongodb');
    
    await connect(process.env.MONGO_URI, 'my-app');
    const users = await collection('users').find().toArray();
}
```

---

## 7. 🔌 Understanding & Using Weblibs (.weblib)

WebTR libraries are now easier than ever.
The framework automatically generates an **Import Map** for you.

### How to Import
Instead of long paths, just use the package name:

```javascript
client {
    // Old way (Still works):
    // await import('/packages/webtr/player/player.weblib');

    // ✅ New Way (Recommended):
    const { WebTRPlayer } = await import('webtr:player');
    const mongo = await import('@my-org/utils');
}
```

### Automatic NPM Dependencies
Weblibs can depend on standard NPM packages.
You can declare dependencies directly in your `.weblib` file using the `@npm` annotation in comments.

**Example: A MongoDB Wrapper**
Add `@npm package-name@version` in the file header:

```javascript
/**
 * WebTR MongoDB Helper
 * @npm mongodb@^6.0
 */
import { MongoClient } from 'mongodb';
```

When a user runs `webtr add lib user/mongo-wrapper`:
1.  The CLI scans the `.weblib` file.
2.  It finds `@npm mongodb@^6.0`.
3.  It automatically runs `npm install mongodb@^6.0` in the user's project.

### Importing in Client / Server
```javascript
client {
    // Standard approach using Aliases (thanks to Import Maps)
    const mongo = await import('webtr:mongodb');
### Creating Your Own Weblib
If you want to create a helper library (e.g. `math-utils.weblib`):

1.  Create `webtr_packages/me/utils/math.weblib`:
    ```javascript
    export function add(a, b) { return a + b }
    export const PI = 3.14159;
    ```
2.  Import it with its alias:
    ```javascript
    const { add } = await import('@me/utils');
    ```

### Server-Side Usage (CommonJS vs ESM)
WebTR standardizes on **ES Modules (`import`)**.
Even for server-side code (Node.js), use `import` syntax. The compiler handles the details for Vercel/Node environment.

```javascript
server {
    // Correct way (ESM style)
    import { MongoClient } from 'mongodb';
    const db = await import('webtr:mongodb');
}
```

---

## 8. Extending WebTR: Creating Custom Packages

### Step 1: Logic Libraries (`.weblib`)
Create logic that can be shared across projects.
1.  Create `webtr_packages/<user>/<pkg>/index.weblib`.
2.  Write standard ES6 Class/Function code.
3.  Add `package.json`: `{"main": "index.weblib"}`.

### Step 2: Styling Libraries (`.trs`)
1.  Create `webtr_packages/<user>/<pkg>/index.trs`.
2.  Add `package.json`: `{"style": "index.trs"}`.

### Step 3: Publish
Push to GitHub. Users install via `webtr add style <user>/<pkg>`.

---

## 9. Best Practices for AI

1.  **Check Installed Packages:** Read `webtr.json` to see what's available.
2.  **Use Existing Classes:** Don't reinvent the wheel. If `webtr:glass` is there, use `.glass-card`.
3.  **Strict Separation:** Logic goes in `client {}`, Style goes in `.trs`.
4.  **Imports:**
    *   Styles: `@import "webtr:package"`
    *   Logic: `await import('/packages/webtr/package/file.weblib')`

---
**WebTR Framework** - *Built by Intelligence, For Intelligence.*
