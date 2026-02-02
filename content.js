// Content Script - Minimal, just for communication
// The actual dark mode is applied via chrome.scripting.insertCSS in background.js

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'ping') {
    sendResponse({ alive: true });
    return true;
  }
  return true;
});
