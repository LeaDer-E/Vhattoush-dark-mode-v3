# Advanced Dark Mode Chrome Extension

A powerful Chrome extension that extracts colors from any webpage, applies dark mode instantly without refresh, and allows you to customize each color individually.

## Features

- **Instant Dark Mode**: Apply dark mode to any website without refreshing the page
- **Color Extraction**: Automatically extracts all colors used on the page, sorted by frequency
- **Individual Color Control**: Click any extracted color to change it to any color you want
- **Auto-Generate Dark Theme**: One-click to automatically generate a dark theme based on extracted colors
- **Quick Presets**: Choose from pre-made dark theme presets (Dark, Navy, Deep, Neon)
- **Cross-Tab Sync**: Changes apply to all open tabs automatically
- **Persistent State**: Your settings are saved and restored when you revisit pages

## Installation

### Method 1: Load Unpacked Extension (Developer Mode)

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" using the toggle in the top right corner
3. Click "Load unpacked" button
4. Select the `Vhattoush-dark-mode-v3` folder containing these files
5. The extension icon should appear in your Chrome toolbar

### Method 2: From Chrome Web Store (When Published)

1. Visit the Chrome Web Store
2. Search for "Advanced Dark Mode with Color Control"
3. Click "Add to Chrome"

## How to Use

### Basic Usage

1. **Navigate to any website** (e.g., https://maharatech.gov.eg/)
2. **Click the extension icon** in your Chrome toolbar
3. **Toggle "Enable Dark Mode"** to instantly apply dark mode

### Advanced Features

#### Extract Page Colors

1. Click the **"Extract Page Colors"** button
2. Wait a moment while the extension analyzes the page
3. The extracted colors will appear in the list, sorted by frequency of use

#### Customize Individual Colors

1. After extracting colors, **click on any color** in the list
2. Use the color picker or enter a hex code to change it
3. Click **"Apply"** to see the change instantly on the page
4. The change is saved and applied to all tabs

#### Auto-Generate Dark Theme

1. After extracting colors, click **"Auto Generate Dark Theme"**
2. The extension will automatically create a dark theme by:
   - Converting light colors to dark shades
   - Keeping dark colors visible
3. You can still customize individual colors after auto-generation

#### Use Quick Presets

1. Choose from 4 presets:
   - **Dark**: Classic dark theme (#1a1a1a background)
   - **Navy**: Deep blue dark theme (#0d1b2a background)
   - **Deep**: Purple-tinted dark theme (#1a1a2e background)
   - **Neon**: High contrast with accent colors

#### Reset Everything

Click **"Reset All"** to:
- Disable dark mode
- Clear all color mappings
- Clear extracted colors
- Return the page to its original state

## How It Works

The extension uses a three-layer architecture:

1. **Content Script**: Injected into every webpage to communicate with the page
2. **Injected Script**: Runs directly in the page context to access and modify styles
3. **Background Script**: Manages state persistence and cross-tab communication

When you enable dark mode:
- A dynamic stylesheet is injected into the page
- Color mappings are applied to override specific colors
- The extension monitors for new elements and applies styles automatically

## Technical Details

### Color Extraction

The extension scans all elements on the page and extracts colors from:
- `color` property
- `background-color` property
- `border-color` properties
- `background-image` (gradients)
- `box-shadow` and `text-shadow`
- SVG `fill` and `stroke` properties

### Color Mapping

When you change a color:
- The original color is mapped to the new color
- All elements using that color are updated instantly
- The mapping is saved to Chrome storage
- Changes are broadcast to all open tabs

### Performance

- Uses CSS for efficient style application
- MutationObserver for automatic updates on dynamic content
- WeakSet to track processed elements and avoid duplicates
- Minimal impact on page performance

## Troubleshooting

### Extension Not Working

1. Make sure the extension is enabled in `chrome://extensions/`
2. Try refreshing the page and clicking the extension icon again
3. Check the browser console for any error messages

### Colors Not Extracting

1. Some websites may block content scripts
2. Try refreshing the page before extracting colors
3. Wait a few seconds after clicking "Extract Page Colors"

### Changes Not Applying

1. Make sure dark mode is enabled
2. Try clicking "Auto Generate Dark Theme" first
3. Check if the website has strict Content Security Policy (CSP)

## Supported Websites

This extension works on most websites, including:
- https://maharatech.gov.eg/
- Stack Overflow
- GitHub
- Wikipedia
- Most news websites
- Most blogs and documentation sites

Some websites with strict CSP or shadow DOM may have limited support.

## Privacy

This extension:
- Does not collect any user data
- Does not send data to external servers
- Stores settings only in Chrome's local storage
- Requires minimal permissions (activeTab, storage, scripting)

## License

MIT License - Feel free to modify and distribute.

## Credits

Created with care for developers and users who prefer dark mode.
