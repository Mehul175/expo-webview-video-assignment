import React, { useRef, useState } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Notifications from 'expo-notifications';
import { useNavigation } from '@react-navigation/native';
import { Button, Card, Text, Portal, Snackbar } from 'react-native-paper';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function WebViewScreen() {
  const navigation = useNavigation();
  const webViewRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Request notification permissions
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

  // Schedule notification with delay
  const scheduleNotification = async (title, body, delaySeconds) => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: true,
          data: { screen: 'VideoPlayer' },
        },
        trigger: {
          seconds: delaySeconds,
        },
      });
      setSnackbarMessage(`Notification scheduled! It will appear in ${delaySeconds} seconds.`);
      setSnackbarVisible(true);
    } catch (error) {
      console.error('Error scheduling notification:', error);
      Alert.alert('Error', 'Failed to schedule notification');
    }
  };

  // Handle notification tap to navigate
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

  // Send notification when WebView finishes loading (Bonus feature)
  const handleLoadEnd = async () => {
    setLoading(false);
    await scheduleNotification(
      'WebView Loaded! 🎉',
      'The website has finished loading successfully.',
      2
    );
  };

  // Notification button handlers
  const handleNotification1 = () => {
    scheduleNotification(
      'Hello from WebView! 👋',
      'This is the first notification triggered from the WebView page. It will appear in 3 seconds.',
      3
    );
  };

  const handleNotification2 = () => {
    scheduleNotification(
      'Second Notification 🔔',
      'This is the second notification with a different message. It will appear in 4 seconds.',
      4
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.webViewContainer}>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6200ee" />
            <Text style={styles.loadingText}>Loading website...</Text>
          </View>
        )}
        <WebView
          ref={webViewRef}
          source={{ uri: 'https://expo.dev' }}
          style={styles.webView}
          onLoadEnd={handleLoadEnd}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.warn('WebView error: ', nativeEvent);
            setLoading(false);
            Alert.alert('Error', 'Failed to load the website');
          }}
        />
      </View>

      <Card style={styles.card} mode="elevated">
        <Card.Content>
          <Text variant="titleMedium" style={styles.cardTitle}>
            Trigger Notifications
          </Text>
          <Text variant="bodySmall" style={styles.cardSubtitle}>
            Tap the buttons below to schedule notifications with delays
          </Text>

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
    marginTop: 10,
    color: '#6200ee',
  },
  card: {
    margin: 16,
    marginTop: 8,
  },
  cardTitle: {
    marginBottom: 4,
    fontWeight: 'bold',
  },
  cardSubtitle: {
    marginBottom: 16,
    color: '#666',
  },
  buttonContainer: {
    gap: 12,
    marginBottom: 12,
  },
  button: {
    marginBottom: 8,
  },
  button1: {
    // Styled via buttonColor prop
  },
  button2: {
    // Styled via buttonColor prop
  },
  videoButton: {
    marginTop: 8,
    borderColor: '#6200ee',
  },
});
