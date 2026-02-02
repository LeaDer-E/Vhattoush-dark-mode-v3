// Injected script for direct page access - Optimized Version
(function() {
  'use strict';

  // Prevent multiple injections
  if (window.__darkModeInjected) return;
  window.__darkModeInjected = true;

  console.log('[Dark Mode] Injected script loaded');

  // Color utilities
  const ColorUtils = {
    // Parse any color format to RGBA
    parseColor(color) {
      if (!color || color === 'transparent' || color === 'none' || color === 'inherit' || color === 'initial') return null;

      const temp = document.createElement('div');
      temp.style.color = color;
      temp.style.display = 'none';
      document.body.appendChild(temp);
      const computed = getComputedStyle(temp).color;
      document.body.removeChild(temp);

      const match = computed.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
      if (!match) return null;

      return {
        r: parseInt(match[1]),
        g: parseInt(match[2]),
        b: parseInt(match[3]),
        a: match[4] ? parseFloat(match[4]) : 1
      };
    },

    // Convert RGB to hex
    rgbToHex(r, g, b) {
      return '#' + [r, g, b].map(x => {
        const hex = Math.round(x).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      }).join('');
    },

    // Normalize color to hex
    normalize(color) {
      const rgba = this.parseColor(color);
      if (!rgba) return null;
      return this.rgbToHex(rgba.r, rgba.g, rgba.b).toLowerCase();
    },

    // Get luminance of a color
    getLuminance(r, g, b) {
      const [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    }
  };

  // Dark mode engine - Optimized
  const DarkModeEngine = {
    enabled: false,
    colorMappings: {},
    observer: null,
    styleSheet: null,
    isProcessing: false,

    // Initialize
    init() {
      this.createStyleSheet();
    },

    // Create dynamic stylesheet
    createStyleSheet() {
      if (this.styleSheet) return;
      this.styleSheet = document.createElement('style');
      this.styleSheet.id = '__dark-mode-styles';
      document.documentElement.appendChild(this.styleSheet);
    },

    // Extract colors using batch processing (non-blocking)
    async extractColors() {
      const colors = new Map();
      const elements = document.querySelectorAll('*');
      const totalElements = elements.length;
      const batchSize = 100; // Process 100 elements at a time

      console.log(`[Dark Mode] Extracting colors from ${totalElements} elements...`);

      for (let i = 0; i < totalElements; i += batchSize) {
        const batch = Array.from(elements).slice(i, i + batchSize);

        // Process batch
        batch.forEach(el => {
          try {
            // Only check computed style for visible elements
            const rect = el.getBoundingClientRect();
            if (rect.width === 0 && rect.height === 0) return;

            const computed = getComputedStyle(el);
            const colorProps = ['color', 'background-color'];

            colorProps.forEach(prop => {
              const value = computed.getPropertyValue(prop);
              if (value && value !== 'none' && value !== 'transparent') {
                const normalized = ColorUtils.normalize(value);
                if (normalized) {
                  const count = colors.get(normalized) || 0;
                  colors.set(normalized, count + 1);
                }
              }
            });
          } catch (e) {
            // Skip elements that can't be accessed
          }
        });

        // Yield control to browser every batch
        if (i + batchSize < totalElements) {
          await new Promise(resolve => setTimeout(resolve, 0));
        }
      }

      // Sort by frequency and return top 50 colors
      const sortedColors = Array.from(colors.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 50)
        .map(([color, count]) => ({ color, count }));

      console.log(`[Dark Mode] Found ${sortedColors.length} unique colors`);
      return sortedColors;
    },

    // Generate dark mode color
    generateDarkColor(rgba) {
      const { r, g, b, a } = rgba;
      const luminance = ColorUtils.getLuminance(r, g, b);
      const isLight = luminance > 0.5;

      if (isLight) {
        const factor = 0.15;
        return {
          r: Math.round(255 - r * factor),
          g: Math.round(255 - g * factor),
          b: Math.round(255 - b * factor),
          a: a
        };
      } else {
        const factor = 1.3;
        return {
          r: Math.min(255, Math.round(r * factor + 30)),
          g: Math.min(255, Math.round(g * factor + 30)),
          b: Math.min(255, Math.round(b * factor + 30)),
          a: a
        };
      }
    },

    // Apply dark mode
    apply(enabled, colorMappings = {}) {
      this.enabled = enabled;
      this.colorMappings = colorMappings || {};

      if (enabled) {
        this.applyDarkMode();
      } else {
        this.removeDarkMode();
      }
    },

    // Apply dark mode styles
    applyDarkMode() {
      const css = this.generateDarkModeCSS();
      this.styleSheet.textContent = css;
      document.documentElement.classList.add('__dark-mode-active');
    },

    // Remove dark mode
    removeDarkMode() {
      if (this.styleSheet) {
        this.styleSheet.textContent = '';
      }
      document.documentElement.classList.remove('__dark-mode-active');
    },

    // Generate CSS for dark mode
    generateDarkModeCSS() {
      // Build color mapping CSS
      let colorCSS = '';
      Object.entries(this.colorMappings).forEach(([original, mapped]) => {
        const escapedOriginal = original.replace(/(["\\])/g, '\\$1');
        colorCSS += `
          html.__dark-mode-active [style*="color: ${escapedOriginal}" i],
          html.__dark-mode-active [style*="background-color: ${escapedOriginal}" i] {
            color: ${mapped} !important;
          }
        `;
      });

      return `
        /* Base dark mode styles */
        html.__dark-mode-active,
        html.__dark-mode-active body {
          background-color: #1a1a1a !important;
          color: #e0e0e0 !important;
        }

        html.__dark-mode-active * {
          border-color: #404040 !important;
        }

        /* Form elements */
        html.__dark-mode-active input,
        html.__dark-mode-active textarea,
        html.__dark-mode-active select,
        html.__dark-mode-active button {
          background-color: #2d2d2d !important;
          color: #e0e0e0 !important;
          border-color: #404040 !important;
        }

        /* Links */
        html.__dark-mode-active a {
          color: #4da6ff !important;
        }

        html.__dark-mode-active a:visited {
          color: #b366ff !important;
        }

        /* Images and media */
        html.__dark-mode-active img,
        html.__dark-mode-active video,
        html.__dark-mode-active canvas,
        html.__dark-mode-active iframe {
          filter: brightness(0.85) contrast(1.1) !important;
        }

        /* Background images */
        html.__dark-mode-active [style*="background-image"] {
          filter: brightness(0.7) !important;
        }

        /* Tables */
        html.__dark-mode-active table,
        html.__dark-mode-active th,
        html.__dark-mode-active td {
          background-color: #1a1a1a !important;
          border-color: #404040 !important;
          color: #e0e0e0 !important;
        }

        html.__dark-mode-active th {
          background-color: #2d2d2d !important;
        }

        /* Code blocks */
        html.__dark-mode-active code,
        html.__dark-mode-active pre {
          background-color: #2d2d2d !important;
          color: #e0e0e0 !important;
        }

        /* Scrollbars */
        html.__dark-mode-active ::-webkit-scrollbar {
          width: 10px;
        }

        html.__dark-mode-active ::-webkit-scrollbar-track {
          background: #1a1a1a;
        }

        html.__dark-mode-active ::-webkit-scrollbar-thumb {
          background: #404040;
          border-radius: 5px;
        }

        /* Selection */
        html.__dark-mode-active ::selection {
          background-color: #4da6ff !important;
          color: #000 !important;
        }

        /* Custom color mappings */
        ${colorCSS}
      `;
    },

    // Update single color mapping
    updateColorMapping(originalColor, newColor) {
      this.colorMappings[originalColor.toLowerCase()] = newColor;
      if (this.enabled) {
        this.applyDarkMode();
      }
    }
  };

  // Initialize
  DarkModeEngine.init();

  // Listen for messages from content script
  window.addEventListener('message', async (event) => {
    if (event.source !== window) return;

    const { type, data } = event.data;

    if (type === '__DARK_MODE_EXTRACT_COLORS') {
      const colors = await DarkModeEngine.extractColors();
      window.postMessage({
        type: '__DARK_MODE_COLORS_EXTRACTED',
        colors: colors
      }, '*');
    }

    if (type === '__DARK_MODE_APPLY') {
      DarkModeEngine.apply(data.enabled, data.colorMappings);
    }

    if (type === '__DARK_MODE_UPDATE_COLOR') {
      DarkModeEngine.updateColorMapping(data.original, data.new);
    }
  });

  // Store reference globally
  window.__darkModeEngine = DarkModeEngine;
})();
rk-mode-active header,
        html.__dark-mode-active footer,
        html.__dark-mode-active main {
          background-color: inherit;
        }

        /* Border colors */
        html.__dark-mode-active *,
        html.__dark-mode-active *::before,
        html.__dark-mode-active *::after {
          border-color: #404040 !important;
        }

        /* Form elements */
        html.__dark-mode-active input,
        html.__dark-mode-active textarea,
        html.__dark-mode-active select,
        html.__dark-mode-active button {
          background-color: #2d2d2d !important;
          color: #e0e0e0 !important;
          border-color: #404040 !important;
        }

        /* Links */
        html.__dark-mode-active a {
          color: #4da6ff !important;
        }

        html.__dark-mode-active a:visited {
          color: #b366ff !important;
        }

        /* Images and media */
        html.__dark-mode-active img,
        html.__dark-mode-active video,
        html.__dark-mode-active canvas {
          filter: brightness(0.85) contrast(1.1) !important;
        }

        /* Background images */
        html.__dark-mode-active [style*="background-image"] {
          filter: brightness(0.7) !important;
        }

        /* SVG */
        html.__dark-mode-active svg {
          filter: brightness(0.9) !important;
        }

        /* Tables */
        html.__dark-mode-active table,
        html.__dark-mode-active th,
        html.__dark-mode-active td {
          background-color: #1a1a1a !important;
          border-color: #404040 !important;
          color: #e0e0e0 !important;
        }

        html.__dark-mode-active th {
          background-color: #2d2d2d !important;
        }

        /* Code blocks */
        html.__dark-mode-active code,
        html.__dark-mode-active pre {
          background-color: #2d2d2d !important;
          color: #e0e0e0 !important;
        }

        /* Scrollbars */
        html.__dark-mode-active ::-webkit-scrollbar {
          width: 12px;
          height: 12px;
        }

        html.__dark-mode-active ::-webkit-scrollbar-track {
          background: #1a1a1a;
        }

        html.__dark-mode-active ::-webkit-scrollbar-thumb {
          background: #404040;
          border-radius: 6px;
        }

        html.__dark-mode-active ::-webkit-scrollbar-thumb:hover {
          background: #505050;
        }

        /* Selection */
        html.__dark-mode-active ::selection {
          background-color: #4da6ff !important;
          color: #000 !important;
        }
      `;

      // Add color-specific rules from mappings
      Object.entries(this.colorMappings).forEach(([original, mapped]) => {
        const rgba = ColorUtils.parseColor(original);
        if (rgba) {
          css += this.generateColorCSS(original, mapped);
        }
      });

      return css;
    },

    // Generate CSS for specific color
    generateColorCSS(original, mapped) {
      // Escape special characters for CSS selector
      const escapedOriginal = original.replace(/(["\\])/g, '\\$1');

      return `
        html.__dark-mode-active [style*="color: ${escapedOriginal}" i],
        html.__dark-mode-active [style*="color:${escapedOriginal}" i],
        html.__dark-mode-active [style*="background-color: ${escapedOriginal}" i],
        html.__dark-mode-active [style*="background-color:${escapedOriginal}" i],
        html.__dark-mode-active [style*="border-color: ${escapedOriginal}" i],
        html.__dark-mode-active [style*="border-color:${escapedOriginal}" i],
        html.__dark-mode-active [style*="background: ${escapedOriginal}" i],
        html.__dark-mode-active [style*="background:${escapedOriginal}" i] {
          color: ${mapped} !important;
        }
      `;
    },

    // Update single color mapping in real-time
    updateColorMapping(originalColor, newColor) {
      this.colorMappings[originalColor.toLowerCase()] = newColor;
      if (this.enabled) {
        this.applyDarkMode();
      }
    },

    // Apply to new elements
    applyToNewElements() {
      if (this.enabled) {
        this.applyDarkMode();
      }
    }
  };

  // Initialize
  DarkModeEngine.init();

  // Listen for messages from content script
  window.addEventListener('message', (event) => {
    if (event.source !== window) return;

    const { type, data } = event.data;

    if (type === '__DARK_MODE_EXTRACT_COLORS') {
      const colors = DarkModeEngine.extractColors();
      window.postMessage({
        type: '__DARK_MODE_COLORS_EXTRACTED',
        colors: colors
      }, '*');
    }

    if (type === '__DARK_MODE_APPLY') {
      DarkModeEngine.apply(data.enabled, data.colorMappings);
    }

    if (type === '__DARK_MODE_UPDATE_COLOR') {
      DarkModeEngine.updateColorMapping(data.original, data.new);
    }
  });

  // Store reference globally
  window.__darkModeEngine = DarkModeEngine;
})();
