const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class ProjectGenerator {
    constructor() {
        this.templatesPath = path.join(__dirname, '../../templates');
        this.outputBasePath = path.join(process.cwd(), 'output');
    }

    async generateAndroidProject(config) {
        try {
            console.log('Starting project generation with config:', config);
            
            // Validate configuration
            this.validateConfig(config);
            
            // Create unique project directory
            const projectId = uuidv4().substring(0, 8);
            const sanitizedAppName = this.sanitizeFileName(config.appName);
            const projectDirName = `${sanitizedAppName}_${projectId}`;
            
            const outputPath = config.outputPath || this.outputBasePath;
            const projectPath = path.join(outputPath, projectDirName);
            
            // Ensure output directory exists
            await fs.ensureDir(projectPath);
            
            // Copy base template
            await this.copyBaseTemplate(projectPath);
            
            // Process template files
            await this.processTemplateFiles(projectPath, config);
            
            // Handle source files
            if (config.sourceType === 'local' && config.sourcePath) {
                await this.copyLocalAssets(projectPath, config.sourcePath);
            }
            
            // Copy icon if provided
            if (config.iconPath) {
                await this.copyIcon(projectPath, config.iconPath);
            }
            
            console.log('Project generated successfully at:', projectPath);
            return projectPath;
            
        } catch (error) {
            console.error('Project generation failed:', error);
            throw error;
        }
    }

    validateConfig(config) {
        const required = ['appName', 'packageName', 'sourceType'];
        for (const field of required) {
            if (!config[field]) {
                throw new Error(`Missing required field: ${field}`);
            }
        }

        if (config.sourceType === 'url' && !config.sourceUrl) {
            throw new Error('Source URL is required for URL type');
        }

        if (config.sourceType === 'local' && !config.sourcePath) {
            throw new Error('Source path is required for local type');
        }

        // Validate package name format - more permissive to allow numbers
        const packageRegex = /^[a-zA-Z][a-zA-Z0-9_]*(\.([a-zA-Z0-9_]+))*$/;
        if (!packageRegex.test(config.packageName)) {
            throw new Error('Invalid package name format');
        }
    }

    async copyBaseTemplate(projectPath) {
        const baseTemplatePath = path.join(this.templatesPath, 'android-base');
        
        if (!(await fs.pathExists(baseTemplatePath))) {
            throw new Error('Base template not found. Please ensure templates are installed.');
        }
        
        await fs.copy(baseTemplatePath, projectPath);
    }

    async processTemplateFiles(projectPath, config) {
        const replacements = this.createReplacements(config);
        
        // First, handle Java package structure and copy MainActivity.java to correct location
        await this.createJavaPackageStructure(projectPath, config.packageName);
        
        // Files to process with replacements
        const filesToProcess = [
            'app/src/main/AndroidManifest.xml',
            'app/src/main/res/values/strings.xml',
            'app/src/main/res/values/colors.xml',
            'app/src/main/java/{{PACKAGE_PATH}}/MainActivity.java',
            'app/build.gradle',
            'settings.gradle'
        ];

        for (let filePath of filesToProcess) {
            // Replace package path placeholder in file path
            if (filePath.includes('{{PACKAGE_PATH}}')) {
                const packagePath = config.packageName.replace(/\./g, '/');
                filePath = filePath.replace('{{PACKAGE_PATH}}', packagePath);
            }

            const fullPath = path.join(projectPath, filePath);
            
            // Create directory structure if needed
            await fs.ensureDir(path.dirname(fullPath));
            
            if (await fs.pathExists(fullPath)) {
                await this.processTemplateFile(fullPath, replacements);
            }
        }
    }

    createReplacements(config) {
        const permissions = config.permissions || [];
        const permissionTags = permissions.map(perm => 
            `    <uses-permission android:name="android.permission.${perm}" />`
        ).join('\\n');

        // Generate color variants from primary color
        const primaryColor = config.colorScheme || '#f26a1e';
        const colorVariants = this.generateColorVariants(primaryColor);

        return {
            '{{APP_NAME}}': config.appName,
            '{{PACKAGE_NAME}}': config.packageName,
            '{{PERMISSIONS}}': permissionTags,
            '{{PRIMARY_COLOR}}': primaryColor,
            '{{PRIMARY_COLOR_DARK}}': colorVariants.primaryDark,
            '{{ACCENT_COLOR}}': colorVariants.accent,
            '{{SOURCE_URL}}': config.sourceUrl || '',
            '{{SOURCE_TYPE}}': config.sourceType || 'url',
            '{{LOAD_URL}}': this.generateLoadUrlCode(config)
        };
    }

    generateLoadUrlCode(config) {
        if (config.sourceType === 'url') {
            return `webView.loadUrl("${config.sourceUrl}");`;
        } else {
            return `webView.loadUrl("file:///android_asset/index.html");`;
        }
    }

    generateColorVariants(primaryColor) {
        // Remove # if present
        const color = primaryColor.replace('#', '');
        
        // Convert hex to RGB
        const r = parseInt(color.substr(0, 2), 16);
        const g = parseInt(color.substr(2, 2), 16);
        const b = parseInt(color.substr(4, 2), 16);
        
        // Create darker variant (reduce brightness by 20%)
        const darkR = Math.floor(r * 0.8);
        const darkG = Math.floor(g * 0.8);
        const darkB = Math.floor(b * 0.8);
        
        // Create accent variant (slightly different hue, keep same brightness)
        const accentR = Math.min(255, Math.floor(r * 1.1));
        const accentG = Math.min(255, Math.floor(g * 0.9));
        const accentB = Math.min(255, Math.floor(b * 1.05));
        
        // Convert back to hex
        const toHex = (val) => val.toString(16).padStart(2, '0');
        
        return {
            primaryDark: `#${toHex(darkR)}${toHex(darkG)}${toHex(darkB)}`,
            accent: `#${toHex(accentR)}${toHex(accentG)}${toHex(accentB)}`
        };
    }

    async processTemplateFile(filePath, replacements) {
        let content = await fs.readFile(filePath, 'utf8');
        
        for (const [placeholder, value] of Object.entries(replacements)) {
            const regex = new RegExp(placeholder.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&'), 'g');
            content = content.replace(regex, value);
        }
        
        await fs.writeFile(filePath, content, 'utf8');
    }

    async createJavaPackageStructure(projectPath, packageName) {
        const packagePath = packageName.replace(/\./g, '/');
        const javaSourcePath = path.join(projectPath, 'app/src/main/java', packagePath);
        
        await fs.ensureDir(javaSourcePath);
        
        // Move MainActivity.java to correct package location
        const defaultMainActivity = path.join(projectPath, 'app/src/main/java/MainActivity.java');
        const targetMainActivity = path.join(javaSourcePath, 'MainActivity.java');
        
        if (await fs.pathExists(defaultMainActivity)) {
            await fs.move(defaultMainActivity, targetMainActivity);
        }
    }

    async copyLocalAssets(projectPath, sourcePath) {
        const assetsPath = path.join(projectPath, 'app/src/main/assets');
        await fs.ensureDir(assetsPath);
        
        // Check if source path exists and has index.html
        if (!(await fs.pathExists(sourcePath))) {
            throw new Error(`Source path does not exist: ${sourcePath}`);
        }
        
        const indexPath = path.join(sourcePath, 'index.html');
        if (!(await fs.pathExists(indexPath))) {
            throw new Error('index.html not found in source directory');
        }
        
        // Copy all files from source to assets
        await fs.copy(sourcePath, assetsPath);
    }

    async copyIcon(projectPath, iconPath) {
        if (!(await fs.pathExists(iconPath))) {
            console.warn('Icon file not found, skipping icon copy');
            return;
        }

        const iconSizes = [
            { folder: 'mipmap-mdpi', size: 48 },
            { folder: 'mipmap-hdpi', size: 72 },
            { folder: 'mipmap-xhdpi', size: 96 },
            { folder: 'mipmap-xxhdpi', size: 144 },
            { folder: 'mipmap-xxxhdpi', size: 192 }
        ];

        for (const { folder } of iconSizes) {
            const iconDir = path.join(projectPath, 'app/src/main/res', folder);
            await fs.ensureDir(iconDir);
            
            const targetPath = path.join(iconDir, 'ic_launcher.png');
            await fs.copy(iconPath, targetPath);
        }
    }

    sanitizeFileName(name) {
        return name.replace(/[^a-zA-Z0-9_-]/g, '_').replace(/_+/g, '_');
    }
}

// Export function for use in main process
async function generateAndroidProject(config) {
    const generator = new ProjectGenerator();
    return await generator.generateAndroidProject(config);
}

module.exports = { generateAndroidProject, ProjectGenerator };