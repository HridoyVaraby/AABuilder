# AABuilder - Android WebView App Builder

AABuilder is a desktop application built with Electron and Node.js that automates the generation of Android Studio-ready WebView app projects. It provides an intuitive UI for configuring app settings and generates complete Android projects ready for manual build and signing.

## Features

- **Desktop UI**: Clean, intuitive interface for app configuration
- **Multiple Source Types**: Support for both online URLs and local HTML/CSS/JS folders
- **Permission Management**: Easy selection of Android permissions
- **Icon Support**: Upload and automatically resize app icons
- **Color Customization**: Set primary color themes
- **Project Generation**: Creates complete Android Studio projects
- **Offline Support**: Copy local web assets into the Android project

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- For building Android apps: Android Studio and Android SDK

## Installation

1. Clone or download this repository
2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

### Starting the Application

```bash
npm start
```

For development mode with DevTools:
```bash
npm run dev
```

### Creating an Android App

1. **App Information**:
   - Enter your app name (e.g., "My Awesome App")
   - Provide a unique package name (e.g., "com.yourcompany.yourapp")
   - (Optional) Select an app icon (PNG, JPG, or ICO)
   - Choose a primary color for your app theme

2. **Source Configuration**:
   - **Online URL**: Select this option and enter a website URL
   - **Local Folder**: Select this option and choose a folder containing your HTML/CSS/JS files (must include index.html)

3. **Permissions**:
   - Select the Android permissions your app needs
   - Internet access is pre-selected for online apps

4. **Output**:
   - (Optional) Choose where to save the generated project
   - Default location is ./output

5. **Generate**:
   - Click "Generate Android Project"
   - Wait for the process to complete
   - Open the output folder to find your Android Studio project

### Building the Android App

1. Open Android Studio
2. Open the generated project folder
3. Let Android Studio sync the project
4. Build the APK: Build → Build Bundle(s) / APK(s) → Build APK(s)
5. Sign and distribute your app

## Project Structure

```
AABuilder/
├── electron-app/           # Electron application
│   ├── main.js            # Main Electron process
│   ├── preload.js         # Preload script for secure IPC
│   ├── renderer/          # UI components
│   │   ├── index.html     # Main UI
│   │   ├── styles.css     # Styling
│   │   └── script.js      # UI logic
│   └── src/              # Backend logic
│       └── project-generator.js
├── templates/             # Android project templates
│   └── android-base/      # Base Android WebView template
├── output/               # Generated projects location
├── package.json          # Node.js dependencies
└── README.md            # This file
```

## Supported Android Permissions

- `INTERNET` - Internet access (required for online apps)
- `ACCESS_NETWORK_STATE` - Check network connectivity
- `CAMERA` - Access device camera
- `READ_EXTERNAL_STORAGE` - Read files from storage
- `WRITE_EXTERNAL_STORAGE` - Save files to storage
- `ACCESS_FINE_LOCATION` - Access GPS location
- `RECORD_AUDIO` - Record audio
- `VIBRATE` - Device vibration

## Generated Android Project Features

- **WebView Configuration**: Optimized for web content display
- **JavaScript Support**: Enabled with DOM storage
- **File Access**: Supports local asset loading
- **Navigation**: Back button support for web navigation
- **Responsive**: Supports zoom and viewport scaling
- **Material Design**: Modern Android UI components

## Troubleshooting

### App Won't Start
- Ensure Node.js is installed and accessible
- Run `npm install` to install dependencies
- Check console for error messages

### Generation Fails
- Verify package name format (e.g., com.company.app)
- Ensure selected folders/files exist
- Check that local folders contain index.html
- Verify sufficient disk space

### Android Build Issues
- Ensure Android Studio and SDK are properly installed
- Check that generated project structure is intact
- Verify Gradle sync completes successfully

## Development

To modify or extend AABuilder:

1. **UI Changes**: Edit files in `electron-app/renderer/`
2. **Backend Logic**: Modify `electron-app/src/project-generator.js`
3. **Android Templates**: Update files in `templates/android-base/`
4. **Dependencies**: Update `package.json` and run `npm install`

### Adding New Permissions

1. Add the permission to the permissions list in `renderer/index.html`
2. Update the permission validation if needed

### Modifying Android Templates

1. Edit template files in `templates/android-base/`
2. Use `{{PLACEHOLDER}}` syntax for dynamic content
3. Update `project-generator.js` to handle new placeholders

## Build Distribution

To create distributable packages:

```bash
npm run build    # Creates installers for current platform
npm run pack     # Creates unpacked app directory
```

## License

This project is designed for educational and personal use. Please ensure you comply with all relevant licenses when distributing generated Android applications.

## Support

For issues, questions, or contributions, please refer to the project documentation or contact the development team.

---

**Created by**: Hridoy Varaby | Varabit Web Design & Development  
**Purpose**: Automate Android WebView app creation for rapid deployment