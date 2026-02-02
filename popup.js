// Popup Script - Dark Mode Pro
let currentTab = null;
let isDarkModeEnabled = false;
let activePreset = 'default';
let customColors = {};

// DOM Elements
const toggleBtn = document.getElementById('toggleBtn');
const presetBtns = document.querySelectorAll('.preset-btn');
const bgColorInput = document.getElementById('bgColor');
const textColorInput = document.getElementById('textColor');
const secondaryColorInput = document.getElementById('secondaryColor');
const borderColorInput = document.getElementById('borderColor');
const linkColorInput = document.getElementById('linkColor');
const applyColorsBtn = document.getElementById('applyColorsBtn');
const resetColorsBtn = document.getElementById('resetColorsBtn');

// Color value displays
const bgColorValue = document.getElementById('bgColorValue');
const textColorValue = document.getElementById('textColorValue');
const secondaryColorValue = document.getElementById('secondaryColorValue');
const borderColorValue = document.getElementById('borderColorValue');
const linkColorValue = document.getElementById('linkColorValue');

// Preset colors
const presets = {
  default: { bg: '#1a1a2e', text: '#e0e0e0', secondary: '#252540', border: '#404060', link: '#64b5f6' },
  midnight: { bg: '#0d1b2a', text: '#e0e1dd', secondary: '#1b263b', border: '#415a77', link: '#778da9' },
  deep: { bg: '#1a1a2e', text: '#eaeaea', secondary: '#16213e', border: '#0f3460', link: '#e94560' },
  neon: { bg: '#16213e', text: '#e94560', secondary: '#0f3460', border: '#e94560', link: '#00fff5' },
  amoled: { bg: '#000000', text: '#ffffff', secondary: '#1a1a1a', border: '#333333', link: '#64b5f6' }
};

// Initialize
async function init() {
  try {
    // Get current tab
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    currentTab = tabs[0];

    // Load saved state
    const result = await chrome.storage.local.get(['darkModeEnabled', 'customColors', 'activePreset']);
    isDarkModeEnabled = result.darkModeEnabled || false;
    customColors = result.customColors || {};
    activePreset = result.activePreset || 'default';

    // Update UI
    updateToggleButton();
    updatePresetButtons();
    updateColorInputs();

    // Setup event listeners
    setupEventListeners();
  } catch (e) {
    console.error('Init error:', e);
  }
}

// Update toggle button state
function updateToggleButton() {
  if (isDarkModeEnabled) {
    toggleBtn.classList.add('active');
    toggleBtn.querySelector('.btn-text').textContent = 'Deactivate Vhattoush-Dark';
    toggleBtn.querySelector('.btn-icon').textContent = '☀️';
  } else {
    toggleBtn.classList.remove('active');
    toggleBtn.querySelector('.btn-text').textContent = 'Activate Vhattoush-Dark';
    toggleBtn.querySelector('.btn-icon').textContent = '🌙';
  }
}

// Update preset buttons
function updatePresetButtons() {
  presetBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.preset === activePreset);
  });
}

// Update color inputs
function updateColorInputs() {
  const preset = presets[activePreset];
  const colors = { ...preset, ...customColors };

  bgColorInput.value = colors.bg;
  textColorInput.value = colors.text;
  secondaryColorInput.value = colors.secondary;
  borderColorInput.value = colors.border;
  linkColorInput.value = colors.link;

  bgColorValue.textContent = colors.bg;
  textColorValue.textContent = colors.text;
  secondaryColorValue.textContent = colors.secondary;
  borderColorValue.textContent = colors.border;
  linkColorValue.textContent = colors.link;
}

// Setup event listeners
function setupEventListeners() {
  // Toggle button
  toggleBtn.addEventListener('click', async () => {
    isDarkModeEnabled = !isDarkModeEnabled;
    updateToggleButton();

    // Send message to background
    chrome.runtime.sendMessage({
      action: 'toggleDarkMode',
      tabId: currentTab.id,
      enabled: isDarkModeEnabled,
      customColors: customColors,
      preset: activePreset
    }, (response) => {
      if (response && response.success) {
        console.log('Dark mode toggled successfully');
      }
    });
  });

  // Preset buttons
  presetBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
      activePreset = btn.dataset.preset;
      customColors = {}; // Reset custom colors when selecting preset
      updatePresetButtons();
      updateColorInputs();

      // Apply if dark mode is enabled
      if (isDarkModeEnabled) {
        chrome.runtime.sendMessage({
          action: 'toggleDarkMode',
          tabId: currentTab.id,
          enabled: true,
          customColors: customColors,
          preset: activePreset
        });
      }
    });
  });

  // Color input changes
  bgColorInput.addEventListener('input', (e) => {
    customColors.background = e.target.value;
    bgColorValue.textContent = e.target.value;
  });

  textColorInput.addEventListener('input', (e) => {
    customColors.text = e.target.value;
    textColorValue.textContent = e.target.value;
  });

  secondaryColorInput.addEventListener('input', (e) => {
    customColors.secondary = e.target.value;
    secondaryColorValue.textContent = e.target.value;
  });

  borderColorInput.addEventListener('input', (e) => {
    customColors.border = e.target.value;
    borderColorValue.textContent = e.target.value;
  });

  linkColorInput.addEventListener('input', (e) => {
    customColors.link = e.target.value;
    linkColorValue.textContent = e.target.value;
  });

  // Apply custom colors button
  applyColorsBtn.addEventListener('click', async () => {
    if (isDarkModeEnabled) {
      chrome.runtime.sendMessage({
        action: 'toggleDarkMode',
        tabId: currentTab.id,
        enabled: true,
        customColors: customColors,
        preset: activePreset
      });
    }
  });

  // Reset colors button
  resetColorsBtn.addEventListener('click', () => {
    customColors = {};
    updateColorInputs();

    if (isDarkModeEnabled) {
      chrome.runtime.sendMessage({
        action: 'toggleDarkMode',
        tabId: currentTab.id,
        enabled: true,
        customColors: customColors,
        preset: activePreset
      });
    }
  });
}

// Initialize on load
document.addEventListener('DOMContentLoaded', init);
