/**
 * WebViewScreen Component
 * 
 * Displays a WebView with notification functionality:
 * - Embeds expo.dev website
 * - Two notification buttons with different delays
 * - Auto-notification when WebView finishes loading
 * - Navigation to Video Player screen
 * - Snackbar feedback for user actions
 */

import React, { useRef, useState } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Notifications from 'expo-notifications';
import { useNavigation } from '@react-navigation/native';
import { Button, Card, Text, Portal, Snackbar } from 'react-native-paper';
import { moderateScale, moderateVerticalScale } from 'react-native-size-matters';

// ==================== Notification Configuration ====================

/**
 * Configure notification handler behavior
 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// ==================== Component ====================

export default function WebViewScreen() {
  const navigation = useNavigation();

  // ==================== State Management ====================
  const webViewRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // ==================== Effects ====================

  /**
   * Request notification permissions on component mount
   */
  React.useEffect(() => {
    (async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission needed',
          'Please enable notifications in settings to receive notifications.'
        );
      }
    })();
  }, []);

  /**
   * Handle notification tap to navigate to Video Player screen
   */
  React.useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data;
        if (data?.screen === 'VideoPlayer') {
          navigation.navigate('VideoPlayer');
        }
      }
    );

    return () => subscription.remove();
  }, [navigation]);

  // ==================== Notification Functions ====================

  /**
   * Schedule a notification with specified delay
   * @param {string} title - Notification title
   * @param {string} body - Notification body text
   * @param {number} delaySeconds - Delay in seconds before showing notification
   */
  const scheduleNotification = async (title, body, delaySeconds) => {
    try {
      // Ensure delay is at least 1 second and is a valid number
      const delay = Math.max(1, Math.floor(Number(delaySeconds)));

      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: true,
          data: { screen: 'VideoPlayer' },
        },
        trigger: {
          type: 'timeInterval',
          seconds: delay,
          repeats: false,
        },
      });
      setSnackbarMessage(`Notification scheduled! It will appear in ${delay} seconds.`);
      setSnackbarVisible(true);
    } catch (error) {
      console.error('Error scheduling notification:', error);
      Alert.alert('Error', 'Failed to schedule notification');
    }
  };

  // ==================== Event Handlers ====================

  /**
   * Handle WebView load completion - send auto-notification
   */
  const handleLoadEnd = async () => {
    setLoading(false);
    await scheduleNotification(
      'WebView Loaded! 🎉',
      'The website has finished loading successfully.',
      2
    );
  };

  /**
   * Handle WebView load errors
   */
  const handleWebViewError = (syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    console.warn('WebView error: ', nativeEvent);
    setLoading(false);
    Alert.alert('Error', 'Failed to load the website');
  };

  /**
   * Handle Notification 1 button press - schedule notification with 3 second delay
   */
  const handleNotification1 = () => {
    scheduleNotification(
      'Hello from WebView! 👋',
      'This is the first notification triggered from the WebView page. It will appear in 3 seconds.',
      3
    );
  };

  /**
   * Handle Notification 2 button press - schedule notification with 4 second delay
   */
  const handleNotification2 = () => {
    scheduleNotification(
      'Second Notification 🔔',
      'This is the second notification with a different message. It will appear in 4 seconds.',
      4
    );
  };

  // ==================== Render ====================

  return (
    <View style={styles.container}>
      {/* WebView Container */}
      <View style={styles.webViewContainer}>
        {/* Loading Indicator */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6200ee" />
            <Text style={styles.loadingText}>Loading website...</Text>
          </View>
        )}

        {/* WebView */}
        <WebView
          ref={webViewRef}
          source={{ uri: 'https://expo.dev' }}
          style={styles.webView}
          onLoadEnd={handleLoadEnd}
          onError={handleWebViewError}
        />
      </View>

      {/* Notification Controls Card */}
      <Card style={styles.card} mode="elevated">
        <Card.Content>
          <Text variant="titleMedium" style={styles.cardTitle}>
            Trigger Notifications
          </Text>
          <Text variant="bodySmall" style={styles.cardSubtitle}>
            Tap the buttons below to schedule notifications with delays
          </Text>

          {/* Notification Buttons */}
          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={handleNotification1}
              style={[styles.button, styles.button1]}
              buttonColor="#6200ee"
              textColor="#fff"
              icon="bell"
            >
              Notification 1 (3s)
            </Button>

            <Button
              mode="contained"
              onPress={handleNotification2}
              style={[styles.button, styles.button2]}
              buttonColor="#03dac6"
              textColor="#000"
              icon="bell-ring"
            >
              Notification 2 (4s)
            </Button>
          </View>

          {/* Navigation Button */}
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('VideoPlayer')}
            style={styles.videoButton}
            icon="play-circle"
            textColor="#6200ee"
          >
            Go to Video Player
          </Button>
        </Card.Content>
      </Card>

      {/* Snackbar for user feedback */}
      <Portal>
        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={3000}
          action={{
            label: 'OK',
            onPress: () => setSnackbarVisible(false),
          }}
        >
          {snackbarMessage}
        </Snackbar>
      </Portal>
    </View>
  );
}

// ==================== Styles ====================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  webViewContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  webView: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    zIndex: 1,
  },
  loadingText: {
    marginTop: moderateVerticalScale(10),
    color: '#6200ee',
  },
  card: {
    margin: moderateScale(16),
    marginTop: moderateVerticalScale(8),
  },
  cardTitle: {
    marginBottom: moderateVerticalScale(4),
    fontWeight: 'bold',
  },
  cardSubtitle: {
    marginBottom: moderateVerticalScale(16),
    color: '#666',
  },
  buttonContainer: {
    gap: moderateVerticalScale(12),
    marginBottom: moderateVerticalScale(12),
  },
  button: {
    marginBottom: moderateVerticalScale(8),
  },
  button1: {
    // Styled via buttonColor prop
  },
  button2: {
    // Styled via buttonColor prop
  },
  videoButton: {
    marginTop: moderateVerticalScale(8),
    borderColor: '#6200ee',
  },
});
