// DOM elements
const appForm = document.getElementById('app-form');
const sourceTypeRadios = document.querySelectorAll('input[name="sourceType"]');
const urlGroup = document.getElementById('url-group');
const localGroup = document.getElementById('local-group');
const packageNameInput = document.getElementById('package-name');
const packageError = document.getElementById('package-error');
const colorInput = document.getElementById('color-scheme');
const colorTextInput = document.getElementById('color-text');

// File selection elements
const selectIconBtn = document.getElementById('select-icon-btn');
const iconPath = document.getElementById('icon-path');
const selectFolderBtn = document.getElementById('select-folder-btn');
const folderPath = document.getElementById('folder-path');
const selectOutputBtn = document.getElementById('select-output-btn');
const outputPath = document.getElementById('output-path');

// Progress and results elements
const progressSection = document.getElementById('progress-section');
const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');
const resultsSection = document.getElementById('results-section');
const resultsTitle = document.getElementById('results-title');
const resultsMessage = document.getElementById('results-message');
const openOutputBtn = document.getElementById('open-output-btn');
const newProjectBtn = document.getElementById('new-project-btn');
const generateBtn = document.getElementById('generate-btn');

// Global state
let selectedIconPath = null;
let selectedFolderPath = null;
let selectedOutputPath = null;
let generatedProjectPath = null;

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    updateSourceTypeVisibility();
    syncColorInputs();
});

function initializeEventListeners() {
    // Source type change
    sourceTypeRadios.forEach(radio => {
        radio.addEventListener('change', updateSourceTypeVisibility);
    });

    // Package name validation
    packageNameInput.addEventListener('input', debounce(validatePackageName, 300));

    // Color input synchronization
    colorInput.addEventListener('input', () => {
        colorTextInput.value = colorInput.value;
    });
    
    colorTextInput.addEventListener('input', () => {
        if (isValidHexColor(colorTextInput.value)) {
            colorInput.value = colorTextInput.value;
        }
    });

    // File selection buttons
    selectIconBtn.addEventListener('click', selectIcon);
    selectFolderBtn.addEventListener('click', selectFolder);
    selectOutputBtn.addEventListener('click', selectOutputFolder);

    // Form submission
    appForm.addEventListener('submit', handleFormSubmit);

    // Results actions
    openOutputBtn.addEventListener('click', openOutputFolder);
    newProjectBtn.addEventListener('click', resetForm);
}

function updateSourceTypeVisibility() {
    const selectedType = document.querySelector('input[name="sourceType"]:checked').value;
    
    if (selectedType === 'url') {
        urlGroup.style.display = 'block';
        localGroup.style.display = 'none';
        document.getElementById('source-url').required = true;
        document.getElementById('source-folder').required = false;
    } else {
        urlGroup.style.display = 'none';
        localGroup.style.display = 'block';
        document.getElementById('source-url').required = false;
        document.getElementById('source-folder').required = true;
    }
}

function syncColorInputs() {
    colorTextInput.value = colorInput.value;
}

async function validatePackageName() {
    const packageName = packageNameInput.value.trim();
    
    if (!packageName) {
        packageError.textContent = '';
        return;
    }

    try {
        const isValid = await window.electronAPI.validatePackageName(packageName);
        
        if (isValid) {
            packageError.textContent = '';
            packageNameInput.style.borderColor = '#27ae60';
        } else {
            packageError.textContent = 'Invalid package name format. Use format like com.company.app or com.varabit.app123 (letters, numbers, underscores, dots)';
            packageNameInput.style.borderColor = '#e74c3c';
        }
    } catch (error) {
        console.error('Package name validation failed:', error);
    }
}

function isValidHexColor(color) {
    return /^#[0-9A-Fa-f]{6}$/.test(color);
}

async function selectIcon() {
    try {
        const filePath = await window.electronAPI.selectIcon();
        if (filePath) {
            selectedIconPath = filePath;
            iconPath.textContent = filePath;
            iconPath.style.color = '#27ae60';
        }
    } catch (error) {
        console.error('Icon selection failed:', error);
        showToast('Failed to select icon', 'error');
    }
}

async function selectFolder() {
    try {
        const folderPath = await window.electronAPI.selectFolder();
        if (folderPath) {
            selectedFolderPath = folderPath;
            document.getElementById('folder-path').textContent = folderPath;
            document.getElementById('folder-path').style.color = '#27ae60';
        }
    } catch (error) {
        console.error('Folder selection failed:', error);
        showToast('Failed to select folder', 'error');
    }
}

async function selectOutputFolder() {
    try {
        const folderPath = await window.electronAPI.selectOutputFolder();
        if (folderPath) {
            selectedOutputPath = folderPath;
            outputPath.textContent = folderPath;
            outputPath.style.color = '#27ae60';
        }
    } catch (error) {
        console.error('Output folder selection failed:', error);
        showToast('Failed to select output folder', 'error');
    }
}

async function handleFormSubmit(event) {
    event.preventDefault();
    
    // Disable HTML5 form validation since we're doing custom validation
    event.target.noValidate = true;
    
    if (!(await validateForm())) {
        return;
    }

    const projectConfig = gatherFormData();
    await generateProject(projectConfig);
}

async function validateForm() {
    const appName = document.getElementById('app-name').value.trim();
    const packageName = packageNameInput.value.trim();
    const sourceType = document.querySelector('input[name="sourceType"]:checked').value;
    
    // Basic validation
    if (!appName) {
        showToast('Please enter an app name', 'error');
        return false;
    }
    
    if (!packageName) {
        showToast('Please enter a package name', 'error');
        return false;
    }
    
    // Package name validation
    const isValidPackage = await window.electronAPI.validatePackageName(packageName);
    if (!isValidPackage) {
        showToast('Please enter a valid package name', 'error');
        return false;
    }
    
    // Source validation
    if (sourceType === 'url') {
        const url = document.getElementById('source-url').value.trim();
        if (!url || !isValidUrl(url)) {
            showToast('Please enter a valid URL', 'error');
            return false;
        }
    } else {
        if (!selectedFolderPath) {
            showToast('Please select a local folder', 'error');
            return false;
        }
    }
    
    return true;
}

function gatherFormData() {
    const formData = new FormData(appForm);
    const sourceType = formData.get('sourceType');
    
    // Get selected permissions
    const permissions = Array.from(document.querySelectorAll('input[name="permissions"]:checked'))
        .map(checkbox => checkbox.value);
    
    const config = {
        appName: formData.get('appName').trim(),
        packageName: formData.get('packageName').trim(),
        sourceType: sourceType,
        colorScheme: formData.get('colorScheme'),
        permissions: permissions,
        iconPath: selectedIconPath,
        outputPath: selectedOutputPath || './output'
    };
    
    if (sourceType === 'url') {
        config.sourceUrl = formData.get('sourceUrl').trim();
    } else {
        config.sourcePath = selectedFolderPath;
    }
    
    return config;
}

async function generateProject(projectConfig) {
    try {
        // Show progress
        showProgress();
        
        // Simulate progress steps
        const progressSteps = [
            { text: 'Validating configuration...', progress: 10 },
            { text: 'Creating project structure...', progress: 25 },
            { text: 'Processing templates...', progress: 50 },
            { text: 'Injecting configurations...', progress: 75 },
            { text: 'Finalizing project...', progress: 90 },
            { text: 'Project generation complete!', progress: 100 }
        ];
        
        for (let i = 0; i < progressSteps.length - 1; i++) {
            updateProgress(progressSteps[i].progress, progressSteps[i].text);
            await delay(500); // Simulate work
        }
        
        // Actually generate the project
        updateProgress(95, 'Generating Android project...');
        const result = await window.electronAPI.generateProject(projectConfig);
        
        if (result.success) {
            updateProgress(100, 'Project generation complete!');
            generatedProjectPath = result.outputPath;
            
            await delay(500);
            showResults(true, `Project successfully generated at: ${result.outputPath}`);
        } else {
            throw new Error(result.error || 'Unknown error occurred');
        }
        
    } catch (error) {
        console.error('Project generation failed:', error);
        showResults(false, error.message);
    }
}

function showProgress() {
    appForm.style.display = 'none';
    progressSection.style.display = 'block';
    resultsSection.style.display = 'none';
}

function updateProgress(percentage, text) {
    progressFill.style.width = `${percentage}%`;
    progressText.textContent = text;
}

function showResults(success, message) {
    progressSection.style.display = 'none';
    resultsSection.style.display = 'block';
    
    if (success) {
        resultsTitle.textContent = '✅ Project Generated Successfully!';
        resultsTitle.style.color = '#27ae60';
        openOutputBtn.style.display = 'inline-block';
    } else {
        resultsTitle.textContent = '❌ Generation Failed';
        resultsTitle.style.color = '#e74c3c';
        openOutputBtn.style.display = 'none';
    }
    
    resultsMessage.textContent = message;
}

async function openOutputFolder() {
    if (generatedProjectPath) {
        try {
            // Request main process to open the folder
            await window.electronAPI.openOutputFolder(generatedProjectPath);
        } catch (error) {
            console.error('Failed to open output folder:', error);
            showToast('Failed to open output folder', 'error');
        }
    }
}

function resetForm() {
    // Reset form
    appForm.reset();
    
    // Reset file selections
    selectedIconPath = null;
    selectedFolderPath = null;
    selectedOutputPath = null;
    generatedProjectPath = null;
    
    // Reset UI elements
    iconPath.textContent = 'No icon selected';
    iconPath.style.color = '';
    document.getElementById('folder-path').textContent = 'No folder selected';
    document.getElementById('folder-path').style.color = '';
    outputPath.textContent = 'Default: ./output';
    outputPath.style.color = '';
    
    // Reset package name validation
    packageError.textContent = '';
    packageNameInput.style.borderColor = '';
    
    // Reset sections
    appForm.style.display = 'block';
    progressSection.style.display = 'none';
    resultsSection.style.display = 'none';
    
    // Update visibility
    updateSourceTypeVisibility();
    syncColorInputs();
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function showToast(message, type = 'info') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    // Style the toast
    Object.assign(toast.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '12px 20px',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '600',
        zIndex: '10000',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease',
        maxWidth: '300px',
        wordWrap: 'break-word'
    });
    
    // Set background color based on type
    const colors = {
        error: '#e74c3c',
        success: '#27ae60',
        info: '#3498db',
        warning: '#f39c12'
    };
    toast.style.backgroundColor = colors[type] || colors.info;
    
    // Add to DOM
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 3000);
}