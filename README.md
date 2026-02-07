# 🇹🇷 WebTR Framework - The Ultimate AI Developer Guide

> **🤖 FOR AI MODELS & AGENTS:**
> You are working with **WebTR**, a custom Node.js-based compile-time web framework. It is **NOT** React, Vue, or Svelte. It has its own unique syntax and architecture.
> **You MUST read this document to understand how to write valid code, use newly created libraries, and manage packages.**
>
> **Current State:** The framework is fully functional with a Compiler, Dev Server (HMR), and a Package Manager.

---

## 📚 Table of Contents
1. [Project Status & Changelog](#1-project-status--changelog)
2. [Getting Started (For Humans & AI)](#2-getting-started)
3. [The .webtr DSL (Component Syntax)](#4-the-webtr-dsl-component-syntax)
4. [The .trs Styling System](#5-the-trs-styling-system)
5. **[Library & Package System (CRITICAL)](#6-library--package-system-critical)**
6. [🛠️ Extending WebTR: Creating Custom Packages](#7-extending-webtr-creating-custom-packages)
7. [Best Practices for AI](#8-best-practices-for-ai)

---

## 1. Project Status & Changelog

We have built a complete ecosystem from scratch. Here is what has been added to the project main directory:

*   ✅ **Compiler Core:** Custom RegEx-based parser for `.webtr` (HTML/JS/State) and `.trs` (CSS-like) files.
*   ✅ **CLI Tool:** `bin/webtr.js` handles commands like `dev`, `build`, `add`.
*   ✅ **Dev Server:** A custom Node.js HTTP server with authentic **Hot Module Replacement (HMR)** via SSE.
*   ✅ **Package Manager:** A Git-based package manager that installs libraries into `webtr_packages/` and checks for updates.
*   ✅ **Routing System:** A client-side router (`WebTR.navigate`) built into the generated bundle.
*   ✅ **Standard Libraries:**
    *   **Glass UI:** A premium CSS library (`webtr/glass`).
    *   **Player SDK:** A robust JavaScript class for handling video logic (`webtr/player`).
*   ✅ **Demo App:** "Anime Site" proving the framework's capability.

---

## 2. Getting Started

### Installation
Since this is a custom framework, you don't install it via npm. You clone this repository.

1.  **Clone:** `git clone https://github.com/hzKamburga/webtr`
2.  **Setup:** Ensure Node.js v18+ is installed.

### Creating a Project
```bash
# Initialize a new project structure
node bin/webtr.js init my-app
cd my-app
```

### Running Development Server
This starts the HMR server.
```bash
node ../bin/webtr.js dev -p 3000
```

### Building for Production
```bash
node ../bin/webtr.js build
```

---

## 3. File Structure

```text
d:\WebTR\
├── bin\              # CLI Entry point
├── src\
│   ├── compiler\     # The Logic: parser-webtr.js, parser-trs.js, generator.js
│   └── cli\          # The Tools: dev.js (Server), packages.js (Pkg Manager)
├── webtr_packages\   # INSTALLED LIBRARIES (The "node_modules" of WebTR)
│   └── webtr\        # Official packages (glass, player, ui, etc.)
└── anime-site\       # Example Project
    ├── src\          # Source Code
    │   ├── index.webtr
    │   └── style.trs
    └── webtr.json    # Project Config & Dependencies
```

---

## 4. The .webtr DSL (Component Syntax)

A `.webtr` file compiles to HTML, CSS, and JS. It has 4 blocks:

### 1. `state`
Reactive variables. Changing these automatically updates the DOM.
```webtr
state {
  count = 0
  user = { name: "Ali" }
  isLoading = false
}
```

### 2. `view`
Indentation-based HTML.
*   **Variables:** `{count}`
*   **Events:** `@click="handleClick"`
*   **Attributes:** `src="{user.image}"`
*   **Control Flow:** `if`, `each`

```webtr
view {
  div.container {
    h1 { "Hello {user.name}" }
    
    if isLoading {
      span { "Loading..." }
    }
    
    button.btn @click="increment" { "Count: {count}" }
  }
}
```

### 3. `client`
Browser-side JavaScript. Has direct access to `state`.
```javascript
client {
  // Lifecycle: Code here runs on mount
  console.log("Component mounted");

  function increment() {
    count++; // Triggers UI update automatically
  }
}
```

### 4. `server` (Optional)
Node.js code. Compiles to API endpoints.
```javascript
server {
  import db from 'my-db';
  
  async function getData() {
    return await db.query('SELECT * FROM users');
  }
}
```

---

## 5. The .trs Styling System

A custom CSS preprocessor similar to Sass/Stylus.

```trs
// Variables
$primary = #e30a17
$spacing = 16px

// Imports from Packages
@import "webtr:glass" 

// Nesting & Variables
.container {
  padding: $spacing
  background: black
  
  .title {
    color: $primary
    &:hover { color: white }
  }
}
```

---

## 6. Library & Package System (CRITICAL)

This is the most important part for AI agents. Since you cannot "npm install" arbitrary packages, you must use the `webtr_packages` ecosystem we built.

### How Packages Work
*   **Install:** `webtr add style webtr:glass` or `webtr add lib webtr:player`.
*   **Location:** Files live in `webtr_packages/org/pkg-name/`.
*   **Updates:** The CLI checks `package.json` versions in these folders against GitHub.

---

### Available Libraries (API References)

#### 🎨 `webtr/glass` (Glassmorphism UI)
**Type:** Style Library
**Usage:** Import in your `.trs` file.
**Install:** `webtr add style webtr:glass`

```trs
@import "webtr:glass"

// Usage in View:
// div.glass-card { ... }
// button.glass-btn { ... }
// input.glass-input { ... }
```

**Features:**
*   `.glass-card`: Frosted glass container with hover glow.
*   `.glass-btn`: Transparent, blurred button.
*   `.glass-input`: Stylish active/inactive states.
*   `.glass-title`: Gradient text.

---

#### 🎬 `webtr/player` (Headless Video Player)
**Type:** Logic Library (JS)
**Usage:** Dynamic Import in `.webtr` client block.
**Install:** `webtr add lib webtr:player`

**Class API:** `WebTRPlayer`
Use this class to control video elements easily.

```javascript
client {
  // 1. Dynamic Import
  setTimeout(async () => {
    const { WebTRPlayer } = await import('/packages/webtr/player/player.js');
    
    // 2. Initialize
    const player = new WebTRPlayer("myVideoId");
    player.mount();
    
    // 3. Control
    player.togglePlay();
    player.seek(50); // Seek to 50%
    player.toggleMute();
  });
  
  // Wrapper for template events
  function handlePlayClick() {
     // You need to store 'player' instance in a variable accessible here
     player.togglePlay();
  }
}
```

**State & Events:**
The player automatically syncs with `WebTR.state` if you use it.
*   `isPlaying` (bool)
*   `progress` (0-100 string)
*   `isMuted` (bool)
*   `videoTitle` (string - manually set)
*   `toggleFullscreen()`: Requests fullscreen.

---

#### 🎭 `webtr/player-ui` (Player Themes)
**Type:** Style Library
**Usage:** Import in `.trs` file.
**Install:** `webtr add style webtr:player-ui`

```trs
@import "webtr:player-ui"
// Provides classes like: .player-container, .player-controls
```

---

## 7. 🛠️ Extending WebTR: Creating Custom Packages

So you want to create your own library (e.g., a Slider or a new Theme)? Follow this guide.

### Step 1: Create the Directory
Go to `webtr_packages/` and create your organization and package folder.
*   Format: `webtr_packages/<username>/<package-name>`
*   Example: `webtr_packages/ali/slider`

### Step 2: Define `package.json`
Every package needs a manifest.

**For Style Libraries (`.trs`):**
```json
{
  "name": "@ali/slider",
  "version": "1.0.0",
  "description": "A cool slider",
  "style": "index.trs" 
}
```

**For Logic Libraries (`.js`):**
```json
{
  "name": "@ali/utils",
  "version": "1.0.0",
  "description": "Helper functions",
  "main": "index.js"
}
```

### Step 3: Write Your Code
*   **Style:** Create `index.trs`. This file will be imported via `@import "ali:slider"`.
*   **Logic:** Create `index.js` (ES Module). This file can be imported via `await import('/packages/ali/utils/index.js')`.

### Step 4: Publish (Git)
WebTR uses Git for package management.
1.  Initialize git in `webtr_packages` (if not already).
2.  Commit your new folder.
3.  Push to a GitHub repository (e.g., `github.com/ali/webtr-packages`).

### Step 5: Install Elsehere
Now other users can install your package:
```bash
webtr add style ali/slider
```

---

## 8. Best Practices for AI

1.  **Always Check `webtr.json`:** See what packages are installed before writing code.
2.  **Use the Generated Class Names:** If `webtr:glass` is installed, **USE** `.glass-card` instead of writing custom CSS for cards.
3.  **Encapsulate Logic:** When creating complex interactive components (like a slider or gallery), strictly separate the Logic (Client block) from Style (TRS).
4.  **Reactivity:** Do not manually manipulate DOM (e.g., `document.getElementById('text').innerText = '...'`). Instead, update a `state` variable: `text = 'New Value'`.
5.  **Imports:**
    *   **CSS:** `@import "webtr:package-name"` at the top of `.trs`.
    *   **JS:** `await import('/packages/webtr/name/file.js')` inside `client {}`.

---
**WebTR Framework** - *Built for the Future of AI-Assisted Development.*
