package {{PACKAGE_NAME}};

import android.annotation.SuppressLint;
import android.content.DialogInterface;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.WindowInsets;
import android.view.WindowInsetsController;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.LinearLayout;
import androidx.activity.OnBackPressedCallback;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

public class MainActivity extends AppCompatActivity {

    private static final String TAG = "MainActivity";
    private WebView webView;
    private String initialUrl;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        Log.d(TAG, "onCreate() called");

        webView = findViewById(R.id.webview);
        
        // Configure WebView settings
        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);
        webSettings.setLoadWithOverviewMode(true);
        webSettings.setUseWideViewPort(true);
        webSettings.setBuiltInZoomControls(true);
        webSettings.setDisplayZoomControls(false);
        webSettings.setSupportZoom(true);
        webSettings.setDefaultTextEncodingName("utf-8");
        
        // Allow file access for local assets
        webSettings.setAllowFileAccess(true);
        webSettings.setAllowContentAccess(true);
        webSettings.setAllowFileAccessFromFileURLs(true);
        webSettings.setAllowUniversalAccessFromFileURLs(true);

        // Set WebViewClient to handle page navigation
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                view.loadUrl(url);
                return true;
            }
        });

        // Handle edge-to-edge display for Android 15+
        handleEdgeToEdge();

        // Modern back button handling for Android 13+ (API 33+)
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                Log.d(TAG, "Modern OnBackPressedCallback triggered");
                handleBackPress();
            }
        });

        // Load the specified content and store initial URL
        {{LOAD_URL}}
        
        // Store the initial URL for comparison
        String sourceUrl = "{{SOURCE_URL}}";
        String sourceType = "{{SOURCE_TYPE}}";
        
        if ("local".equals(sourceType)) {
            initialUrl = "file:///android_asset/index.html";
        } else {
            initialUrl = sourceUrl;
        }
        
        Log.d(TAG, "Initial URL set to: " + initialUrl);
    }

    /**
     * Handle edge-to-edge display for Android 15+
     */
    private void handleEdgeToEdge() {
        Log.d(TAG, "handleEdgeToEdge() called");
        
        try {
            // Apply edge-to-edge insets to the WebView
            ViewCompat.setOnApplyWindowInsetsListener(webView, (v, insets) -> {
                Log.d(TAG, "Applying window insets to WebView");
                
                // Get system window insets
                WindowInsetsCompat systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
                
                // Apply padding to the WebView to account for system bars
                v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
                
                // Return the consumed insets
                return insets;
            });
        } catch (Exception e) {
            Log.e(TAG, "Error handling edge-to-edge: " + e.getMessage(), e);
        }
    }

    /**
     * Fallback for older Android versions (API < 33)
     */
    @Override
    public void onBackPressed() {
        Log.d(TAG, "Fallback onBackPressed() called");
        handleBackPress();
    }

    /**
     * Centralized back press handling logic
     */
    private void handleBackPress() {
        Log.d(TAG, "=== handleBackPress() START ===");
        
        try {
            String currentUrl = webView.getUrl();
            boolean canGoBack = webView.canGoBack();
            
            Log.d(TAG, "Current URL: " + currentUrl);
            Log.d(TAG, "WebView canGoBack: " + canGoBack);
            
            if (canGoBack) {
                Log.d(TAG, "WebView can go back - navigating back");
                webView.goBack();
            } else {
                Log.d(TAG, "On main page - showing exit dialog");
                showExitConfirmationDialog();
            }
        } catch (Exception e) {
            Log.e(TAG, "Error in handleBackPress(): " + e.getMessage(), e);
            // Fallback: show exit dialog
            showExitConfirmationDialog();
        }
        
        Log.d(TAG, "=== handleBackPress() END ===");
    }

    /**
     * Show exit confirmation dialog using standard AlertDialog.Builder
     * (Compatible with AppCompat themes)
     */
    private void showExitConfirmationDialog() {
        Log.d(TAG, "showExitConfirmationDialog() called");
        
        try {
            Log.d(TAG, "Creating and showing exit dialog");
            
            new AlertDialog.Builder(this)
                    .setTitle("Exit App")
                    .setMessage("Are you sure you want to exit the app?")
                    .setIcon(android.R.drawable.ic_dialog_alert)
                    .setPositiveButton("Exit", new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(DialogInterface dialog, int which) {
                            Log.d(TAG, "User chose to exit - calling finish()");
                            finish();
                        }
                    })
                    .setNegativeButton("Cancel", new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(DialogInterface dialog, int which) {
                            Log.d(TAG, "User chose to cancel - dismissing dialog");
                            dialog.dismiss();
                        }
                    })
                    .setCancelable(true)
                    .setOnCancelListener(new DialogInterface.OnCancelListener() {
                        @Override
                        public void onCancel(DialogInterface dialog) {
                            Log.d(TAG, "Dialog cancelled by user");
                        }
                    })
                    .show();
                    
            Log.d(TAG, "Exit dialog created and shown successfully");
            
        } catch (Exception e) {
            Log.e(TAG, "Exception while showing dialog: " + e.getMessage(), e);
            // Fallback: finish the activity
            Log.d(TAG, "Fallback: finishing activity directly");
            finish();
        }
    }

    @Override
    protected void onStart() {
        super.onStart();
        Log.d(TAG, "onStart() called");
    }

    @Override
    protected void onResume() {
        super.onResume();
        Log.d(TAG, "onResume() called");
    }

    @Override
    protected void onPause() {
        super.onPause();
        Log.d(TAG, "onPause() called");
    }

    @Override
    protected void onStop() {
        super.onStop();
        Log.d(TAG, "onStop() called");
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        Log.d(TAG, "onDestroy() called");
    }
}