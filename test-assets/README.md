# AABuilder Test Icon

This folder contains test assets for the AABuilder application.

For testing the icon functionality, you can use any PNG image file (preferably 512x512 pixels) as an app icon.

## Test Instructions

1. Start AABuilder: `npm start`
2. Fill in the form:
   - App Name: "Test WebView App"
   - Package Name: "com.varabit.testapp"
   - Source Type: Select "Local Folder"
   - Local Folder: Select the "test-assets" folder
   - Icon: (Optional) Select any PNG image
   - Permissions: Keep default selections
3. Click "Generate Android Project"
4. Check the output folder for the generated Android Studio project

## Expected Output

The generated project should contain:
- Proper package structure
- HTML assets copied to app/src/main/assets/
- MainActivity configured to load local assets
- Manifest with selected permissions
- Gradle build files ready for Android Studio