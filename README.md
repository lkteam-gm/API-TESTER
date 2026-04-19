<div align="center">

# ⚡ API Tester — LK-TEAM

**A professional, lightweight API testing tool built for the web.**  
Test REST endpoints instantly — no backend, no installation, no account required.

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-181717?style=flat-square&logo=github&logoColor=white)](https://pages.github.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-6C63FF?style=flat-square)](LICENSE)
[![Made by LK-TEAM](https://img.shields.io/badge/Made%20by-LK--TEAM-3BC4F2?style=flat-square)](#)

</div>

---

## 📖 Overview

**API Tester by LK-TEAM** is a fully client-side API testing tool that runs directly in your browser. It supports all major HTTP methods, custom headers, request bodies, query parameters, and authentication schemes — with syntax-highlighted JSON responses and a polished dark/light UI.

No Node.js. No build step. No server. Just open `index.html` and go.

> 🌐 **Live Demo:** [Hosted on GitHub Pages](#)  *(replace with your Pages URL)*

---

## ✨ Features

| Feature | Description |
|---|---|
| 🌐 **HTTP Methods** | GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS |
| 🔑 **Authentication** | Bearer Token, Basic Auth, API Key (header or query param) |
| 📝 **Request Body** | JSON, Form URL-encoded, Plain text, or None |
| 🔎 **Query Params** | Key-value editor that auto-appends to the URL |
| 📋 **Custom Headers** | Add unlimited custom request headers |
| 🎨 **Syntax Highlighting** | Color-coded JSON responses (keys, strings, numbers, booleans, nulls) |
| 📊 **Response Info** | Status code, status text, response time, and body size |
| 📂 **Response Headers** | View all response headers in a formatted list |
| 🌙 **Dark / Light Theme** | Persistent theme toggle saved to `localStorage` |
| 📱 **Fully Responsive** | Optimized layout for mobile, tablet, and desktop |
| ⚡ **Pretty / Raw View** | Toggle between formatted and raw response body |
| 📋 **Copy to Clipboard** | One-click copy of the full response body |
| 🗑️ **Clear All** | Instantly reset the entire form |
| 🔒 **Zoom Disabled** | Mobile-safe viewport prevents accidental pinch-to-zoom |

---

## 🖼️ Screenshots

> *Add screenshots here after deploying. Example:*

| Dark Mode | Light Mode |
|:---:|:---:|
| ![Dark Mode](screenshots/dark.png) | ![Light Mode](screenshots/light.png) |

| Mobile View | Response Panel |
|:---:|:---:|
| ![Mobile](screenshots/mobile.png) | ![Response](screenshots/response.png) |

---

## 🚀 Getting Started

### Option 1 — Open Directly (Simplest)

No setup needed. Just download and open:

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/api-tester.git

# Open in your browser
cd api-tester
start index.html        # Windows
open index.html         # macOS
xdg-open index.html     # Linux
```

### Option 2 — Local HTTP Server (Recommended)

Some browsers restrict `file://` requests. Serve locally instead:

```bash
# Python 3
python -m http.server 8080

# Node.js (npx)
npx serve .

# PHP
php -S localhost:8080
```

Then visit `http://localhost:8080`.

### Option 3 — GitHub Pages (Production)

1. Fork or push this repository to GitHub.
2. Go to **Settings → Pages**.
3. Set source to `main` branch, root `/` folder.
4. Your app is live at `https://YOUR_USERNAME.github.io/REPO_NAME/`.

---

## 📁 Project Structure

```
api-tester/
├── index.html       # App markup & structure
├── style.css        # Design system, themes, responsive layout
├── app.js           # All application logic (vanilla JS)
├── README.md        # This file
└── LICENSE          # MIT License
```

> **No dependencies. No build tools. No `node_modules`.** Everything is self-contained in three files.

---

## 🛠️ How It Works

### Sending a Request

1. Enter the **endpoint URL** in the URL bar.
2. Select the **HTTP method** from the dropdown.
3. *(Optional)* Configure **Headers**, **Body**, **Params**, or **Auth** via the tabs.
4. Click **Send** (or press `Enter`).

The app uses the native browser `fetch()` API to make the request. The response is displayed with:

- A **status badge** (color-coded by HTTP status class: 2xx green, 4xx orange, 5xx red)
- **Elapsed time** in milliseconds
- **Body size** in bytes / KB / MB
- **Syntax-highlighted** JSON body (or raw text)
- All **response headers** in a searchable list

### Authentication

| Type | How it works |
|---|---|
| **Bearer Token** | Adds `Authorization: Bearer <token>` header |
| **Basic Auth** | Encodes `user:password` as Base64 and adds `Authorization: Basic <base64>` header |
| **API Key — Header** | Adds a custom header with your specified key name and value |
| **API Key — Query** | Appends `?key=value` to the request URL |

### Themes

The theme preference is stored in `localStorage` under the key `lkt-theme` and is restored on every page load.

---

## 🎨 Design System

The UI is built on a custom CSS design system using CSS custom properties (variables). Both dark and light themes are defined on the `:root` and `[data-theme]` selectors — no JavaScript is needed for the theme switch except toggling the attribute.

**Typography:** [Inter](https://fonts.google.com/specimen/Inter) (UI) + [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) (code/monospace)

**Accent palette:**

| Name | Hex | Usage |
|---|---|---|
| Violet | `#6C63FF` | Primary accent, brand gradient start |
| Cyan | `#3BC4F2` | Brand gradient end, links |
| Emerald | `#22c55e` | 2xx success status |
| Amber | `#f59e0b` | 3xx redirect status |
| Orange | `#f97316` | 4xx client error status |
| Red | `#ef4444` | 5xx server error status |

---

## ⚠️ CORS & Browser Limitations

Since this is a **client-side only** tool running in a browser, it is subject to the browser's **Same-Origin Policy**. Requests to APIs that do **not** include proper `Access-Control-Allow-Origin` headers will fail with a CORS error.

**Workarounds:**

- Use APIs that already support CORS (most public APIs do).
- Use a CORS proxy like [`corsproxy.io`](https://corsproxy.io/) or [`allorigins.win`](https://api.allorigins.win/).
- Install a browser extension that disables CORS for development.
- Test with your own backend that has CORS configured.

> This is a browser limitation, not a bug in the app.

---

## 🤝 Contributing

Contributions are welcome! Here's how to get involved:

1. **Fork** the repository.
2. **Create** a feature branch: `git checkout -b feature/my-feature`
3. **Commit** your changes: `git commit -m "feat: add my feature"`
4. **Push** to your branch: `git push origin feature/my-feature`
5. **Open a Pull Request** and describe your changes.

### Ideas for Contributions

- [ ] Request history / saved requests
- [ ] Import/Export collections (JSON)
- [ ] cURL command generator from current request
- [ ] WebSocket support
- [ ] Response diff viewer
- [ ] Keyboard shortcuts overlay
- [ ] PWA support (offline usage)

---

## 🐛 Bug Reports

If you find a bug, please [open an issue](https://github.com/YOUR_USERNAME/api-tester/issues) and include:

- Your browser & version
- Steps to reproduce
- Expected vs actual behavior
- Screenshot (if applicable)

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2026 LK-TEAM

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

---

## 👥 Credits

Designed and developed with ♥ by **LK-TEAM**.

> *Built to be fast, clean, and dead simple. No bloat, no frameworks, no nonsense.*

---

<div align="center">

**[⬆ Back to top](#-api-tester--lk-team)**

</div>
