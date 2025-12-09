# 📘 Expo WebView + Notifications + Video Player App

A React Native Expo application that demonstrates WebView integration, local notifications, and HLS video playback.

## 🎯 Features

### ✅ Core Requirements

- **WebView Page**: Embeds a website (expo.dev) with interactive controls
- **Local Notifications**: Two distinct notification buttons with 2-5 second delays
- **HLS Video Player**: Full-featured video player with custom controls
- **Navigation**: Smooth navigation between WebView and Video Player screens
- **Component Library**: Built with React Native Paper for modern, accessible UI

### ⭐ Bonus Features Implemented

- ✅ **Notification on WebView Load**: Automatically sends a notification when the website finishes loading
- ✅ **Notification Navigation**: Tapping a notification opens the Video Player page
- ✅ **Custom Video Controls**: 
  - Play/Pause functionality
  - Seek forward/backward (10 seconds)
  - Mute/Unmute toggle
  - Progress bar with time indicators
  - Video status information

## 🛠 Tech Stack

- **Expo SDK**: ~54.0.27
- **React Native**: 0.81.5
- **React Navigation**: Native Stack Navigator for screen navigation
- **React Native Paper**: Material Design component library for UI
- **expo-av**: Video playback and HLS stream support
- **expo-notifications**: Local notification scheduling and handling
- **react-native-webview**: WebView component for embedding websites

## 📦 Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the Expo development server**:
   ```bash
   npm start
   ```

3. **Run on your device**:
   - Scan the QR code with Expo Go app (iOS/Android)
   - Or press `i` for iOS simulator
   - Or press `a` for Android emulator

## 🏗 Project Structure

```
expo-webview-video-assignment/
├── App.js                 # Main app component with navigation
├── index.js              # Entry point
├── app.json              # Expo configuration
├── package.json          # Dependencies
├── assets/               # App icons and images
└── src/
    └── screens/
        ├── WebViewScreen.js      # WebView + Notifications screen
        └── VideoPlayerScreen.js  # HLS Video Player screen
```

## 📱 Screen Details

### WebView Screen

- **Embedded Website**: Loads https://expo.dev in a WebView
- **Notification Buttons**:
  - **Notification 1**: Triggers after 3 seconds with a greeting message
  - **Notification 2**: Triggers after 4 seconds with a different message
- **Auto Notification**: Sends a notification automatically when the WebView finishes loading (2 second delay)
- **Navigation**: Button to navigate to the Video Player screen
- **User Feedback**: Snackbar notifications confirm when notifications are scheduled

### Video Player Screen

- **HLS Stream**: Plays test HLS video from Mux test streams
- **Custom Controls**:
  - **Play/Pause**: Toggle video playback
  - **Seek Controls**: Skip forward/backward by 10 seconds
  - **Mute Toggle**: Enable/disable audio
  - **Progress Bar**: Visual progress indicator with time stamps
- **Video Info**: Displays current playback status
- **Navigation**: Back button to return to WebView screen

## 🔔 Notification Implementation

### Notification Configuration

- **Permissions**: Automatically requests notification permissions on app launch
- **Handler**: Configured to show alerts, play sounds, and set badges
- **Delays**: 
  - WebView load notification: 2 seconds
  - Notification 1: 3 seconds
  - Notification 2: 4 seconds

### Notification Navigation

When a notification is tapped, the app automatically navigates to the Video Player screen (if the notification data includes the screen parameter).

## 🎨 Design Choices

### Component Library: React Native Paper

**Why React Native Paper?**
- Material Design components that are accessible and well-tested
- Consistent theming and styling
- Rich component set (Buttons, Cards, Snackbars, etc.)
- Excellent documentation and community support
- Works seamlessly with Expo

### UI/UX Decisions

1. **Card-based Layout**: Used Material Design cards for better visual hierarchy
2. **Color Scheme**: Primary purple (#6200ee) for consistency with Material Design
3. **Loading States**: Added loading indicators for better user feedback
4. **Error Handling**: Graceful error handling with user-friendly messages
5. **Progress Indicators**: Visual feedback for video playback progress

## 🧪 Testing

### Local Testing

The app has been tested and works correctly with:
- ✅ Expo Go on iOS devices
- ✅ Expo Go on Android devices
- ✅ iOS Simulator
- ✅ Android Emulator

### Key Test Scenarios

1. **WebView Loading**: Verify website loads correctly
2. **Notifications**: Test both notification buttons with different delays
3. **Notification Navigation**: Tap notifications to verify navigation works
4. **Video Playback**: Test play, pause, seek, and mute controls
5. **Navigation**: Verify smooth transitions between screens

## 📝 Code Quality

- **Clean Structure**: Organized file structure with clear separation of concerns
- **Error Handling**: Try-catch blocks for async operations
- **Comments**: Inline comments explaining key functionality
- **Consistent Styling**: StyleSheet for consistent styling approach
- **React Best Practices**: Proper use of hooks, refs, and effects

## 🚀 Running the App

### Development Mode

```bash
npm start
```

### Platform-Specific

```bash
# iOS
npm run ios

# Android
npm run android

# Web (limited support)
npm run web
```

## 📋 Requirements Checklist

- ✅ WebView page with embedded website
- ✅ Two buttons triggering different notifications
- ✅ Notifications with 2-5 second delays
- ✅ HLS video player page
- ✅ Play, pause, and fullscreen controls (custom controls implemented)
- ✅ Navigation between pages
- ✅ Component library (React Native Paper)
- ✅ Works in Expo Go
- ✅ README with implementation details

## 🎓 Learning Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Paper](https://callstack.github.io/react-native-paper/)
- [React Navigation](https://reactnavigation.org/)
- [Expo AV](https://docs.expo.dev/versions/latest/sdk/av/)
- [Expo Notifications](https://docs.expo.dev/versions/latest/sdk/notifications/)

## 📄 License

This project is created for educational purposes as part of an assignment.

## 👤 Author

Built with ❤️ using Expo and React Native

---

**Note**: Make sure you have Expo Go installed on your device to test the app. The app requires notification permissions to function fully.
