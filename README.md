# 🚀 AABuilder - Android WebView App Builder

<div align="center">

![AABuilder](https://img.shields.io/badge/Platform-Electron-47848f.svg)
![Version](https://img.shields.io/badge/Version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/License-Educational-green.svg)
![Node](https://img.shields.io/badge/Node.js-v14+-339933.svg)
![Android](https://img.shields.io/badge/Android-API%2021+-3DDC84.svg)

**Transform any website or web app into a professional Android application with just a few clicks!**

</div>

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Screenshots](#-screenshots)
- [Quick Start](#-quick-start)
- [Installation](#-installation)
- [Usage Guide](#-usage-guide)
- [Technical Architecture](#-technical-architecture)
- [Generated Android Features](#-generated-android-features)
- [Advanced Configuration](#-advanced-configuration)
- [Troubleshooting](#-troubleshooting)
- [Development](#-development)
- [Contributing](#-contributing)
- [License](#-license)

## 🎯 Overview

AABuilder is a powerful desktop application built with **Electron** and **Node.js** that automates the generation of production-ready Android WebView applications. Whether you have a responsive website, Progressive Web App (PWA), or local HTML project, AABuilder converts it into a native Android app with modern features and optimizations.

### 🎯 Perfect For:
- **Web Developers** wanting to quickly port web apps to Android
- **Businesses** needing simple Android apps from existing websites
- **Prototyping** mobile app concepts rapidly
- **Content Creators** publishing interactive content as Android apps
- **Educational Projects** demonstrating web-to-mobile conversion

## ✨ Features

### 🖥️ Desktop Application
- **Intuitive GUI**: Clean, modern interface built with Electron
- **Cross-Platform**: Runs on Windows, macOS, and Linux
- **Real-time Validation**: Instant feedback on package names and configurations
- **Drag & Drop Support**: Easy file and folder selection

### 📱 Android Project Generation
- **Multiple Source Types**: 
  - 🌐 **Online URLs**: Convert any website to Android app
  - 📁 **Local Projects**: Bundle HTML/CSS/JS projects for offline use
- **Modern Android Support**: Targets Android API 21+ with latest best practices
- **Material Design**: Generated apps follow Material Design guidelines
- **Java 21 Compatible**: Uses Gradle 8.5 for modern development environment

### 🎨 Customization Options
- **App Icons**: Upload and automatically process PNG, JPG, or ICO files
- **Color Themes**: Set primary colors for consistent branding
- **Permission Management**: Granular control over Android permissions
- **Package Naming**: Robust validation for proper Android package names

### ⚡ Advanced Features
- **Smart Back Button Handling**: Modern OnBackPressedDispatcher with graceful exit dialogs
- **Progressive Enhancement**: Automatic fallbacks for older Android versions
- **Template System**: Extensible template architecture for customization
- **Error Recovery**: Comprehensive error handling and user feedback
- **Project Validation**: Pre-flight checks ensure successful builds

## 📸 Screenshots

*Coming Soon - Add screenshots of the application interface*

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/aabuilder.git
cd aabuilder

# Install dependencies
npm install

# Start the application
npm start
```

**That's it!** The AABuilder GUI will launch, and you can start creating Android apps immediately.

## 📦 Installation

### Prerequisites
- **Node.js** v14 or higher ([Download](https://nodejs.org/))
- **npm** (included with Node.js)
- **Android Studio** (for building the generated projects)
- **Java 21** (recommended for optimal compatibility)

### Development Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/aabuilder.git
   cd aabuilder
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run in development mode**:
   ```bash
   npm run dev  # Includes DevTools for debugging
   ```

### Production Build

```bash
# Create distributable packages
npm run build    # Creates installers for current platform
npm run pack     # Creates unpacked app directory
```

## 📖 Usage Guide

### 1. Launch AABuilder
```bash
npm start
```

### 2. Configure Your App

#### 📝 App Information
- **App Name**: Enter a user-friendly name (e.g., "My Awesome App")
- **Package Name**: Unique identifier following Android conventions (e.g., `com.yourcompany.yourapp`)
  - ✅ Must start with a letter
  - ✅ Can contain letters, numbers, and underscores
  - ✅ Must follow reverse domain notation
- **App Icon** (Optional): Upload PNG, JPG, or ICO files
- **Primary Color**: Choose your app's theme color

#### 🌐 Source Configuration

**Option A: Online URL**
- Select "Online URL" option
- Enter the complete website URL (e.g., `https://example.com`)
- Perfect for converting existing websites to apps

**Option B: Local Project**
- Select "Local Folder" option
- Choose a folder containing your web project
- **Required**: Must include an `index.html` file
- All HTML, CSS, JS, and asset files will be bundled

#### 🔐 Permissions
Select the Android permissions your app requires:
- 🌐 **INTERNET** (Auto-selected for online apps)
- 📶 **ACCESS_NETWORK_STATE** - Check connectivity
- 📷 **CAMERA** - Access device camera
- 📄 **READ_EXTERNAL_STORAGE** - Read files
- 💾 **WRITE_EXTERNAL_STORAGE** - Save files
- 📍 **ACCESS_FINE_LOCATION** - GPS location
- 🎤 **RECORD_AUDIO** - Audio recording
- 📳 **VIBRATE** - Device vibration

### 3. Generate Your Android Project

1. **Choose Output Location** (Optional): Default is `./output`
2. **Click "Generate Android Project"**
3. **Wait for Completion**: The process typically takes 10-30 seconds
4. **Success!**: Your Android Studio project is ready

### 4. Build the Android APK

1. **Open Android Studio**
2. **Open Project**: Select the generated project folder
3. **Sync Project**: Let Gradle sync complete
4. **Build APK**: `Build → Build Bundle(s) / APK(s) → Build APK(s)`
5. **Sign & Distribute**: Follow Android Studio's signing workflow

## 🏗️ Technical Architecture

### Project Structure
```
AABuilder/
├── 📁 electron-app/              # Main Electron application
│   ├── 📄 main.js                # Main process & IPC handlers
│   ├── 📄 preload.js             # Secure IPC bridge
│   ├── 📁 assets/                # Application assets
│   │   └── 📁 icons/             # App icons (256x256, 512x512)
│   ├── 📁 renderer/              # UI layer
│   │   ├── 📄 index.html         # Main interface
│   │   ├── 📄 styles.css         # Modern styling
│   │   └── 📄 script.js          # UI logic & validation
│   └── 📁 src/                   # Core logic
│       └── 📄 project-generator.js # Android project generation
├── 📁 templates/                 # Android project templates
│   └── 📁 android-base/          # Base WebView template
│       ├── 📁 app/src/main/       # Android source structure
│       │   ├── 📄 AndroidManifest.xml
│       │   ├── 📁 java/           # Java source files
│       │   └── 📁 res/            # Android resources
│       ├── 📄 gradle.properties   # Gradle configuration
│       └── 📄 gradlew.bat        # Gradle wrapper
├── 📁 output/                    # Generated projects (gitignored)
├── 📁 test-assets/               # Sample web assets
├── 📄 package.json               # Dependencies & scripts
└── 📄 README.md                 # This documentation
```

### Technology Stack

#### Desktop Application
- **[Electron 38.0.0](https://electronjs.org/)**: Cross-platform desktop framework
- **[Node.js](https://nodejs.org/)**: JavaScript runtime
- **[fs-extra](https://github.com/jprichardson/node-fs-extra)**: Enhanced file system operations
- **[archiver](https://github.com/archiverjs/node-archiver)**: File compression utilities
- **[uuid](https://github.com/uuidjs/uuid)**: Unique identifier generation

#### Generated Android Projects
- **Android API 21+**: Supports Android 5.0 Lollipop and newer
- **Gradle 8.5**: Modern build system with Java 21 compatibility
- **Android Gradle Plugin 8.2.0**: Latest build tools
- **AppCompat**: Backward compatibility for Material Design
- **WebView**: Chromium-based web rendering engine

### Key Features Implementation

#### 🔄 Modern Back Button Handling
```java
// Modern approach for Android 13+ (API 33+)
getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
    @Override
    public void handleOnBackPressed() {
        handleBackPress(); // Custom navigation logic
    }
});

// Fallback for older Android versions
@Override
public void onBackPressed() {
    handleBackPress(); // Ensures compatibility
}
```

#### 🎨 Dynamic Theme Generation
AABuilder automatically generates Android theme files based on your selected primary color:
```xml
<color name="colorPrimary">{{PRIMARY_COLOR}}</color>
<color name="colorPrimaryDark">{{PRIMARY_COLOR_DARK}}</color>
<color name="colorAccent">{{ACCENT_COLOR}}</color>
```

#### 📋 Smart Template Processing
The template system uses placeholder replacement for dynamic content:
- `{{APP_NAME}}` → Your app name
- `{{PACKAGE_NAME}}` → Your package identifier
- `{{PRIMARY_COLOR}}` → Your theme color
- `{{PERMISSIONS}}` → Selected Android permissions

## 📱 Generated Android Features

### 🚀 Performance Optimizations
- **Hardware Acceleration**: Enabled for smooth animations
- **WebView Caching**: Optimized cache settings for faster loading
- **DOM Storage**: Local storage support for web apps
- **JavaScript Optimization**: V8 engine with latest optimizations

### 🎨 Modern UI/UX
- **Material Design**: Follows Google's design guidelines
- **Status Bar Integration**: Proper theme-aware status bar
- **Splash Screen**: Professional app launch experience
- **Exit Confirmation**: User-friendly exit dialogs

### 🔧 Developer-Friendly Features
- **Debug Support**: WebView debugging enabled in debug builds
- **Error Handling**: Comprehensive error pages and fallbacks
- **Console Logging**: JavaScript console accessible via ADB
- **File Access**: Supports local asset loading for offline apps

### 🛡️ Security & Permissions
- **Secure WebView**: Configured with security best practices
- **Permission Management**: Only requests necessary permissions
- **HTTPS Enforcement**: Configurable SSL/TLS settings
- **File Access Control**: Sandboxed file system access

## ⚙️ Advanced Configuration

### Custom Package Name Validation
AABuilder uses robust package name validation:
```javascript
const packageRegex = /^[a-zA-Z][a-zA-Z0-9_]*(\.(\w+))*$/;
```
- ✅ Must start with a letter
- ✅ Supports dots, letters, numbers, underscores
- ✅ Follows Android package naming conventions

### Template Customization
Developers can extend AABuilder by modifying templates:

1. **Edit Base Template**: Modify files in `templates/android-base/`
2. **Add Placeholders**: Use `{{CUSTOM_PLACEHOLDER}}` syntax
3. **Update Generator**: Add placeholder handling in `project-generator.js`
4. **Test Changes**: Use `npm test` to validate templates

### Build Configuration
Customize Electron builds in `package.json`:
```json
"build": {
  "appId": "com.varabit.aabuilder",
  "productName": "AABuilder",
  "win": { "icon": "electron-app/assets/icons/icon256x256.ico" },
  "mac": { "icon": "electron-app/assets/icons/icon512x512.ico" },
  "linux": { "icon": "electron-app/assets/icons/icon512x512.ico" }
}
```

## 🔧 Troubleshooting

### Common Issues & Solutions

#### 🚫 "App Won't Start"
**Symptoms**: AABuilder doesn't launch or crashes immediately

**Solutions**:
1. ✅ Verify Node.js installation: `node --version`
2. ✅ Reinstall dependencies: `rm -rf node_modules && npm install`
3. ✅ Check for port conflicts
4. ✅ Run in development mode: `npm run dev`

#### 🚫 "Project Generation Fails"
**Symptoms**: Error during Android project creation

**Solutions**:
1. ✅ Validate package name format (e.g., `com.company.app`)
2. ✅ Ensure sufficient disk space (>100MB free)
3. ✅ Check folder permissions for output directory
4. ✅ Verify local folder contains `index.html`
5. ✅ Close any files that might be locked

#### 🚫 "Android Build Issues"
**Symptoms**: Generated project won't build in Android Studio

**Solutions**:
1. ✅ Update Android Studio to latest version
2. ✅ Install Android SDK API 21+ via SDK Manager
3. ✅ Verify Gradle sync completes successfully
4. ✅ Check Java version compatibility (Java 21 recommended)
5. ✅ Clear Gradle cache: `./gradlew clean`

#### 🚫 "Package Name Validation Errors"
**Symptoms**: "Invalid package name" despite correct format

**Solutions**:
1. ✅ Ensure no spaces in package name
2. ✅ Start with lowercase letter
3. ✅ Use reverse domain notation: `com.yourcompany.appname`
4. ✅ Avoid reserved keywords (e.g., `android`, `java`)

### Debug Mode
Run AABuilder with enhanced debugging:
```bash
npm run dev  # Opens DevTools for detailed error logs
```

### Log Analysis
Check these locations for detailed logs:
- **Electron Console**: Press F12 in AABuilder
- **Node.js Output**: Terminal running `npm start`
- **Android Studio**: Build logs and Gradle output

## 👨‍💻 Development

### Contributing to AABuilder

We welcome contributions! Here's how to get started:

#### 🔧 Development Setup
1. **Fork & Clone**:
   ```bash
   git clone https://github.com/yourusername/aabuilder.git
   cd aabuilder
   npm install
   ```

2. **Development Workflow**:
   ```bash
   npm run dev     # Start with DevTools
   npm test        # Run validation tests
   npm run build   # Test production build
   ```

#### 📝 Code Structure Guidelines

**UI Changes** (`electron-app/renderer/`):
- Modern ES6+ JavaScript
- CSS Grid/Flexbox for layouts
- Accessibility-first design principles

**Backend Logic** (`electron-app/src/`):
- Node.js with async/await patterns
- Comprehensive error handling
- Detailed logging for debugging

**Android Templates** (`templates/`):
- Follow Android best practices
- Use placeholder syntax: `{{VARIABLE_NAME}}`
- Maintain compatibility with API 21+

#### 🧪 Testing
```bash
# Test template generation
npm test

# Manual testing workflow
1. Generate test project
2. Open in Android Studio
3. Build and run on device/emulator
4. Verify all features work correctly
```

### 🚀 Adding New Features

#### Example: Adding New Permission
1. **Update UI** (`renderer/index.html`):
   ```html
   <label>
     <input type="checkbox" name="permissions" value="NEW_PERMISSION">
     New Permission Description
   </label>
   ```

2. **Update Template** (`templates/android-base/AndroidManifest.xml`):
   ```xml
   <!-- Add conditional permission -->
   {{#if NEW_PERMISSION}}
   <uses-permission android:name="android.permission.NEW_PERMISSION" />
   {{/if}}
   ```

3. **Update Generator** (`src/project-generator.js`):
   ```javascript
   // Add permission handling logic
   const hasNewPermission = projectConfig.permissions.includes('NEW_PERMISSION');
   ```

## 🤝 Contributing

### Ways to Contribute
- 🐛 **Bug Reports**: Found an issue? [Open an issue](https://github.com/yourusername/aabuilder/issues)
- 💡 **Feature Requests**: Have an idea? [Start a discussion](https://github.com/yourusername/aabuilder/discussions)
- 📝 **Documentation**: Improve this README or add tutorials
- 🔧 **Code**: Submit pull requests for bug fixes or new features
- 🧪 **Testing**: Help test on different platforms and Android versions

### Development Guidelines
1. **Follow existing code style** and conventions
2. **Add tests** for new features
3. **Update documentation** for any changes
4. **Test thoroughly** on multiple platforms
5. **Keep commits atomic** and well-described

### Pull Request Process
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request with detailed description

## 📄 License

This project is designed for **educational and personal use**. When distributing generated Android applications:

- ✅ Ensure compliance with web content licenses
- ✅ Follow Google Play Store policies
- ✅ Respect third-party library licenses
- ✅ Include proper attribution where required

### Third-Party Licenses
- **Electron**: MIT License
- **Android SDK**: Apache License 2.0
- **Material Design Icons**: Apache License 2.0

## 🙏 Acknowledgments

### Created By
**Hridoy Varaby**  
[Varabit Web Design & Development](https://varabit.com)

### Special Thanks
- Google Android Team for excellent documentation
- Electron community for robust cross-platform framework
- All contributors and testers who helped improve AABuilder

### Resources & Inspiration
- [Android Developer Documentation](https://developer.android.com/)
- [Electron Documentation](https://electronjs.org/docs)
- [Material Design Guidelines](https://material.io/design)

---

<div align="center">

**⭐ Star this repo if AABuilder helped you create amazing Android apps! ⭐**

[🐛 Report Bug](https://github.com/yourusername/aabuilder/issues) • [💡 Request Feature](https://github.com/yourusername/aabuilder/discussions) • [📖 Documentation](https://github.com/yourusername/aabuilder/wiki)

**Made with ❤️ for the developer community**

</div>