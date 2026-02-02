// Background Service Worker - Current Tab Only

// Default dark mode CSS
const DARK_CSS = `
  html, body {
    background-color: #1a1a2e !important;
    color: #e0e0e0 !important;
  }

  * {
    background-color: inherit !important;
    color: inherit !important;
    border-color: #404060 !important;
  }

  div, section, article, aside, nav, header, footer, main {
    background-color: #1a1a2e !important;
  }

  input, textarea, select, button {
    background-color: #252540 !important;
    color: #e0e0e0 !important;
    border-color: #404060 !important;
  }

  a {
    color: #64b5f6 !important;
  }

  a:visited {
    color: #ba68c8 !important;
  }

  table, th, td {
    background-color: #1a1a2e !important;
    border-color: #404060 !important;
    color: #e0e0e0 !important;
  }

  th {
    background-color: #252540 !important;
  }

  code, pre, kbd, samp {
    background-color: #252540 !important;
    color: #e0e0e0 !important;
  }

  img, video, canvas, iframe, embed, object {
    filter: brightness(0.85) contrast(1.05) !important;
  }

  svg {
    filter: brightness(0.9) !important;
  }

  ::-webkit-scrollbar {
    width: 10px !important;
    height: 10px !important;
  }

  ::-webkit-scrollbar-track {
    background: #1a1a2e !important;
  }

  ::-webkit-scrollbar-thumb {
    background: #404060 !important;
    border-radius: 5px !important;
  }

  ::selection {
    background-color: #64b5f6 !important;
    color: #000000 !important;
  }

  h1, h2, h3, h4, h5, h6 {
    color: #ffffff !important;
  }

  blockquote {
    background-color: #252540 !important;
    border-left-color: #64b5f6 !important;
  }

  hr {
    border-color: #404060 !important;
  }

  [role="tooltip"], .tooltip, .popover {
    background-color: #252540 !important;
    color: #e0e0e0 !important;
    border-color: #404060 !important;
  }

  dialog, [role="dialog"], .modal {
    background-color: #1a1a2e !important;
    color: #e0e0e0 !important;
  }

  select, option, optgroup, [role="listbox"] {
    background-color: #252540 !important;
    color: #e0e0e0 !important;
  }

  *:focus {
    outline-color: #64b5f6 !important;
  }

  ::placeholder {
    color: #808080 !important;
  }

  *[disabled] {
    opacity: 0.5 !important;
  }
`;

// Generate CSS with custom colors
function generateCustomCSS(customColors, preset) {
  const presets = {
    default: { bg: '#1a1a2e', text: '#e0e0e0', secondary: '#252540', border: '#404060' },
    midnight: { bg: '#0d1b2a', text: '#e0e1dd', secondary: '#1b263b', border: '#415a77' },
    deep: { bg: '#1a1a2e', text: '#eaeaea', secondary: '#16213e', border: '#0f3460' },
    neon: { bg: '#16213e', text: '#e94560', secondary: '#0f3460', border: '#e94560' },
    amoled: { bg: '#000000', text: '#ffffff', secondary: '#1a1a1a', border: '#333333' }
  };

  const colors = presets[preset] || presets.default;
  const bg = customColors.background || colors.bg;
  const text = customColors.text || colors.text;
  const secondary = customColors.secondary || colors.secondary;
  const border = customColors.border || colors.border;
  const link = customColors.link || '#64b5f6';

  return `
    html, body {
      background-color: ${bg} !important;
      color: ${text} !important;
    }

    * {
      background-color: inherit !important;
      color: inherit !important;
      border-color: ${border} !important;
    }

    div, section, article, aside, nav, header, footer, main {
      background-color: ${bg} !important;
    }

    input, textarea, select, button {
      background-color: ${secondary} !important;
      color: ${text} !important;
      border-color: ${border} !important;
    }

    a {
      color: ${link} !important;
    }

    a:visited {
      color: #ba68c8 !important;
    }

    table, th, td {
      background-color: ${bg} !important;
      border-color: ${border} !important;
      color: ${text} !important;
    }

    th {
      background-color: ${secondary} !important;
    }

    code, pre, kbd, samp {
      background-color: ${secondary} !important;
      color: ${text} !important;
    }

    img, video, canvas, iframe, embed, object {
      filter: brightness(0.85) contrast(1.05) !important;
    }

    svg {
      filter: brightness(0.9) !important;
    }

    ::-webkit-scrollbar {
      width: 10px !important;
      height: 10px !important;
    }

    ::-webkit-scrollbar-track {
      background: ${bg} !important;
    }

    ::-webkit-scrollbar-thumb {
      background: ${border} !important;
      border-radius: 5px !important;
    }

    ::selection {
      background-color: ${link} !important;
      color: #000000 !important;
    }

    h1, h2, h3, h4, h5, h6 {
      color: #ffffff !important;
    }

    blockquote {
      background-color: ${secondary} !important;
      border-left-color: ${link} !important;
    }

    hr {
      border-color: ${border} !important;
    }

    [role="tooltip"], .tooltip, .popover {
      background-color: ${secondary} !important;
      color: ${text} !important;
      border-color: ${border} !important;
    }

    dialog, [role="dialog"], .modal {
      background-color: ${bg} !important;
      color: ${text} !important;
    }

    select, option, optgroup, [role="listbox"] {
      background-color: ${secondary} !important;
      color: ${text} !important;
    }

    *:focus {
      outline-color: ${link} !important;
    }

    ::placeholder {
      color: #808080 !important;
    }

    *[disabled] {
      opacity: 0.5 !important;
    }
  `;
}

// Apply dark mode to specific tab only
async function applyDarkMode(tabId, customColors = {}, preset = 'default') {
  const css = generateCustomCSS(customColors, preset);
  
  try {
    await chrome.scripting.insertCSS({
      target: { tabId: tabId },
      css: css
    });
    return true;
  } catch (e) {
    console.error('Error applying dark mode:', e);
    return false;
  }
}

// Remove dark mode from specific tab (by reloading)
async function removeDarkMode(tabId) {
  try {
    await chrome.tabs.reload(tabId);
    return true;
  } catch (e) {
    console.error('Error removing dark mode:', e);
    return false;
  }
}

// Handle messages from popup - Current Tab Only
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggleDarkMode') {
    const tabId = request.tabId;
    const enabled = request.enabled;
    const customColors = request.customColors || {};
    const preset = request.preset || 'default';

    // Save state for current session only (not applying to other tabs)
    chrome.storage.local.set({
      darkModeEnabled: enabled,
      customColors: customColors,
      activePreset: preset
    }, async () => {
      if (enabled) {
        const success = await applyDarkMode(tabId, customColors, preset);
        sendResponse({ success: success });
      } else {
        const success = await removeDarkMode(tabId);
        sendResponse({ success: success });
      }
    });

    return true; // Keep channel open for async
  }

  if (request.action === 'getState') {
    chrome.storage.local.get(['darkModeEnabled', 'customColors', 'activePreset'], (result) => {
      sendResponse(result);
    });
    return true;
  }

  return true;
});

// REMOVED: chrome.tabs.onUpdated listener - No longer applies to all tabs automatically
// The extension now works on current tab ONLY when user clicks the button