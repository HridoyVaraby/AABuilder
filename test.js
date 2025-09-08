#!/usr/bin/env node

/**
 * AABuilder Test Script
 * Tests the project generation functionality
 */

const { ProjectGenerator } = require('./electron-app/src/project-generator');
const fs = require('fs-extra');
const path = require('path');

async function runTests() {
    console.log('🧪 Starting AABuilder Tests...\n');
    
    const generator = new ProjectGenerator();
    
    // Test configuration
    const testConfig = {
        appName: 'Test WebView App',
        packageName: 'com.varabit.testapp',
        sourceType: 'local',
        sourcePath: path.join(__dirname, 'test-assets'),
        colorScheme: '#2196F3',
        permissions: ['INTERNET', 'ACCESS_NETWORK_STATE', 'CAMERA'],
        outputPath: path.join(__dirname, 'test-output')
    };
    
    try {
        console.log('📱 Testing project generation...');
        console.log('Config:', JSON.stringify(testConfig, null, 2));
        
        // Generate project
        const outputPath = await generator.generateAndroidProject(testConfig);
        console.log('✅ Project generated successfully at:', outputPath);
        
        // Validate generated files
        console.log('\n🔍 Validating generated files...');
        
        const expectedFiles = [
            'app/src/main/AndroidManifest.xml',
            'app/src/main/java/com/varabit/testapp/MainActivity.java',
            'app/src/main/res/values/strings.xml',
            'app/src/main/res/values/colors.xml',
            'app/src/main/res/layout/activity_main.xml',
            'app/src/main/assets/index.html',
            'app/build.gradle',
            'build.gradle',
            'settings.gradle'
        ];
        
        for (const file of expectedFiles) {
            const filePath = path.join(outputPath, file);
            if (await fs.pathExists(filePath)) {
                console.log('✅', file);
            } else {
                console.log('❌', file, '(missing)');
            }
        }
        
        // Check content replacements
        console.log('\n🔧 Checking content replacements...');
        
        const manifestPath = path.join(outputPath, 'app/src/main/AndroidManifest.xml');
        const manifestContent = await fs.readFile(manifestPath, 'utf8');
        
        if (manifestContent.includes('com.varabit.testapp')) {
            console.log('✅ Package name replacement successful');
        } else {
            console.log('❌ Package name replacement failed');
        }
        
        if (manifestContent.includes('INTERNET') && manifestContent.includes('CAMERA')) {
            console.log('✅ Permissions injection successful');
        } else {
            console.log('❌ Permissions injection failed');
        }
        
        const stringsPath = path.join(outputPath, 'app/src/main/res/values/strings.xml');
        const stringsContent = await fs.readFile(stringsPath, 'utf8');
        
        if (stringsContent.includes('Test WebView App')) {
            console.log('✅ App name replacement successful');
        } else {
            console.log('❌ App name replacement failed');
        }
        
        // Check assets copying
        const assetsIndexPath = path.join(outputPath, 'app/src/main/assets/index.html');
        if (await fs.pathExists(assetsIndexPath)) {
            console.log('✅ Local assets copied successfully');
            
            const assetsContent = await fs.readFile(assetsIndexPath, 'utf8');
            if (assetsContent.includes('Test WebView App')) {
                console.log('✅ Assets content validated');
            } else {
                console.log('❌ Assets content validation failed');
            }
        } else {
            console.log('❌ Local assets copying failed');
        }
        
        console.log('\n🎉 All tests completed!');
        console.log(`📁 Generated project location: ${outputPath}`);
        console.log('💡 You can now open this project in Android Studio to build the APK.');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        process.exit(1);
    }
}

// Run tests if called directly
if (require.main === module) {
    runTests().catch(console.error);
}

module.exports = { runTests };