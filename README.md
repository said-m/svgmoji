# SVGmoji

> Browser extension for quick access to emoji images from popular libraries

## Installation

[Add to Chrome](https://chromewebstore.google.com/detail/fkfpnaflphlcmdjbafoniiaidjcccngh)

## Features

- 🎯 Quick access to emoji images through context menu
- 🖼️ Support for multiple emoji libraries:
  - **Twemoji** (Twitter Emoji)
  - **Noto Color Emoji** (Google)
  - **Openmoji**
  - **Emojione** (Legacy)
  - **JoyPixels** (PNG format)
- 📋 Copy as image or direct link
- 📜 Copy history
- 🎛️ Flexible settings

## How It Works

1. Select any text containing emoji on a webpage
2. Right-click to open the context menu
3. Click "Copy emoji image" to get the image or link

## Settings

- **Source Priority**: Choose your preferred emoji library order
- **Context Menu Mode**: Show/hide source selection in context menu
- **Copy Mode**: Toggle between copying image or direct link
- **History**: View and manage your emoji copy history

## Use Cases

- 📃 **Content Creators**: Embed always up-to-date emoji images in **Notion**, **Confluence**, or **Obsidian** pages by using direct links. Keep your documentation and notes visually appealing and synchronized with the latest emoji designs.
- 🖌️ **Designers**: Quickly copy emoji as images for use in **Figma**, **Adobe Photoshop**, or **Canva**. Enhance your designs with high-quality emoji without manual downloads.
- 🌐 **Social Media Managers**: Easily grab emoji images or links to use in social media posts, marketing materials, or community content. Ensure consistent branding across platforms.
- 🧑‍💻 **Developers**: Use emoji image links in your **GitHub** READMEs, project documentation, or website content. Add visual flair to your projects with minimal effort.

---

## For Developers

### Project Setup

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Build for publication
bun run zip
```

### Development Environment

- WSL (Windows Subsystem for Linux)
- Bun
- WXT (Web Extension Tools)
- Vue 3
- TypeScript

### Project Structure

```
svgmoji/
├── src/
│   ├── entrypoints/
│   │   ├── popup/
│   │   ├── background.ts
│   │   └── content.ts
│   ├── utils/
│   └── components/
└── wxt.config.ts
```

For more details, check out the [WXT documentation](https://wxt.dev).

### API Reference

Source configuration example:

```typescript
{
  title: 'Twemoji',
  path: 'https://raw.githubusercontent.com/twitter/twemoji/master/assets/svg',
  joiner: '-',
  prefix: '',
  postfix: '.svg',
  // Optional transform function
  transform: ({ code }) => code.toUpperCase()
}
```
