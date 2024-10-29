import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  BackHandler,
  ActivityIndicator,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { WebView } from 'react-native-webview';
import NetInfo from '@react-native-community/netinfo';
import { LinearGradient } from 'expo-linear-gradient';
import * as SplashScreen from 'expo-splash-screen';

const App = () => {
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(true);
  const [webViewKey, setWebViewKey] = useState(1);

  useEffect(() => {
    const backAction = () => true;
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    const unsubscribeNetInfo = NetInfo.addEventListener((state) => {
      const connected = state.isConnected;
      setIsConnected(connected);

      if (connected) {
        setWebViewKey((prevKey) => prevKey + 1);
      }
      setLoading(true); // Hide loading overlay on connectivity check
      SplashScreen.hideAsync(); // Ensure splash screen is hidden
    });

    return () => {
      backHandler.remove();
      unsubscribeNetInfo();
    };
  }, []);

  useEffect(() => {
    const prepare = async () => {
      if (isConnected) {
        await SplashScreen.preventAutoHideAsync();
      }
    };
    prepare();
  }, [isConnected]);

  const handleLoadEnd = () => {
    setLoading(false);
    SplashScreen.hideAsync();
  };

  const handleError = () => {
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {isConnected ? (
        <>
          <WebView
            key={webViewKey}
            originWhitelist={['*']}
            source={{ uri: 'https://asianasa.com/' }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            onLoadEnd={handleLoadEnd}
            onError={handleError}
          />
          {loading && (
            <LinearGradient colors={['#80f9f3', '#f6f7f8', '#fce3f2']} style={styles.loadingOverlay}>
              <View style={styles.spinnerContainer}>
                <ActivityIndicator size="large" color="#f64e07" />
                <Text style={styles.loadingText}>Loading...</Text>
              </View>
            </LinearGradient>
          )}
        </>
      ) : (
        <View style={styles.offlineContainer}>
          <Text style={styles.offlineText}>No Internet Connection</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              setWebViewKey((prevKey) => prevKey + 1);
              setLoading(true);
            }}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  spinnerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: "#f64e07",
    fontWeight: 'bold',
  },
  offlineContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  offlineText: {
    fontSize: 20,
    color: '#333',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#4c669f',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default App;
