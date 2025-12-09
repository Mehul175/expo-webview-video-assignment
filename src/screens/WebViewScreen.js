import React, { useRef, useState } from 'react';
import { View, TouchableOpacity, Alert, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Notifications from 'expo-notifications';
import { useNavigation } from '@react-navigation/native';

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

  // Request notification permissions
  React.useEffect(() => {
    (async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please enable notifications in settings');
      }
    })();
  }, []);

  // Schedule notification with delay
  const scheduleNotification = async (title, body, delaySeconds) => {
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

  // Send notification when WebView finishes loading
  const handleLoadEnd = async () => {
    setLoading(false);
    await scheduleNotification(
      'WebView Loaded!',
      'The website has finished loading successfully.',
      2
    );
  };

  // Notification button handlers
  const handleNotification1 = () => {
    scheduleNotification(
      'Hello from WebView!',
      'This is the first notification triggered from the WebView page.',
      3
    );
  };

  const handleNotification2 = () => {
    scheduleNotification(
      'Second Notification',
      'This is the second notification with a different message.',
      4
    );
  };

  return (
    <View className="flex-1 bg-gray-100">
      <WebView
        ref={webViewRef}
        source={{ uri: 'https://expo.dev' }}
        style={{ flex: 1 }}
        onLoadEnd={handleLoadEnd}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn('WebView error: ', nativeEvent);
        }}
      />
      
      <View className="bg-white p-4 border-t border-gray-200">
        <View className="flex-row gap-3">
          <TouchableOpacity
            onPress={handleNotification1}
            className="flex-1 bg-blue-500 py-3 px-4 rounded-lg items-center"
            activeOpacity={0.8}
          >
            <View className="bg-white/20 px-4 py-2 rounded">
              <Text className="text-white font-semibold text-base">
                Notification 1
              </Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={handleNotification2}
            className="flex-1 bg-purple-500 py-3 px-4 rounded-lg items-center"
            activeOpacity={0.8}
          >
            <View className="bg-white/20 px-4 py-2 rounded">
              <Text className="text-white font-semibold text-base">
                Notification 2
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity
          onPress={() => navigation.navigate('VideoPlayer')}
          className="mt-3 bg-green-500 py-3 px-4 rounded-lg items-center"
          activeOpacity={0.8}
        >
          <Text className="text-white font-semibold text-base">
            Go to Video Player
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
