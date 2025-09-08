const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // File selection methods
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  selectIcon: () => ipcRenderer.invoke('select-icon'),
  selectOutputFolder: () => ipcRenderer.invoke('select-output-folder'),
  
  // Project generation
  generateProject: (projectConfig) => ipcRenderer.invoke('generate-project', projectConfig),
  
  // File operations
  openOutputFolder: (path) => ipcRenderer.invoke('open-output-folder', path),
  
  // Validation
  validatePackageName: (packageName) => ipcRenderer.invoke('validate-package-name', packageName),
  
  // Platform information
  platform: process.platform
});