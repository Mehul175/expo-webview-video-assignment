# Expo WebView + Notifications + Video Player Assignment

A React Native Expo application that demonstrates WebView integration, local notifications, and HLS video playback.

## 🎯 Features

### ✅ Core Requirements

1. **WebView Page**
   - Embeds a website (expo.dev) using React Native WebView
   - Two buttons that trigger different local notifications
   - Automatic notification when WebView finishes loading (bonus feature)

2. **Local Notifications**
   - Two distinct notification messages
   - Notifications trigger with delays (2-5 seconds)
   - Notification tap navigation to Video Player page (bonus feature)

3. **Video Player Page**
   - Plays HLS video stream using Expo AV
   - Custom controls: play/pause, seek forward/backward, mute
   - Full video player interface with progress display

4. **Navigation**
   - Smooth navigation between WebView and Video Player pages
   - React Navigation with native stack navigator

5. **UI Components**
   - Modern UI using NativeWind (Tailwind CSS for React Native)
   - Clean, responsive design
   - Custom styled components

## 🛠 Technology Stack

- **React Native** (0.81.5)
- **Expo** (~54.0.27)
- **React Navigation** - For navigation between screens
- **React Native WebView** - For embedding websites
- **Expo Notifications** - For local notifications
- **Expo AV** - For HLS video playback
- **NativeWind** - For styling with Tailwind CSS

## 📦 Installation

1. Clone or navigate to the project directory:
```bash
cd expo-webview-video-assignment
```

2. Install dependencies:
```bash
npm install
```

3. Start the Expo development server:
```bash
npm start
```

4. Run on your device:
   - Scan the QR code with Expo Go app (iOS/Android)
   - Or press `i` for iOS simulator
   - Or press `a` for Android emulator

## 🚀 Usage

### WebView Page
- The page loads expo.dev website
- Two notification buttons are available at the bottom
- Clicking "Notification 1" triggers a notification after 3 seconds
- Clicking "Notification 2" triggers a notification after 4 seconds
- A notification is automatically sent when the WebView finishes loading (after 2 seconds)
- Click "Go to Video Player" to navigate to the video page

### Video Player Page
- Plays HLS video stream from the test URL
- Custom controls:
  - **Play/Pause** button (center)
  - **Seek Backward** 10 seconds (left)
  - **Seek Forward** 10 seconds (right)
  - **Mute/Unmute** toggle
  - **Progress display** showing current time and duration
- Back button to return to WebView page

### Notifications
- When a notification is tapped, it navigates to the Video Player page
- Notifications include sound and badge updates
- Permission is requested on first launch

## 📁 Project Structure

```
expo-webview-video-assignment/
├── App.js                 # Main app with navigation setup
├── app.json              # Expo configuration
├── package.json          # Dependencies
├── babel.config.js       # Babel configuration for NativeWind
├── tailwind.config.js    # Tailwind CSS configuration
├── src/
│   ├── global.css        # Global Tailwind CSS imports
│   └── screens/
│       ├── WebViewScreen.js      # WebView page with notifications
│       └── VideoPlayerScreen.js  # HLS video player page
└── README.md             # This file
```

## 🎨 UI/UX Design Choices

1. **NativeWind (Tailwind CSS)**: Used for modern, utility-first styling
   - Provides consistent design system
   - Easy to maintain and customize
   - Responsive and performant

2. **Custom Video Controls**: Built custom controls instead of using native controls
   - Better user experience
   - More control over functionality
   - Consistent with app design

3. **Color Scheme**: 
   - Blue for primary actions
   - Purple for secondary notifications
   - Green for navigation
   - Black background for video player

## ⭐ Bonus Features Implemented

1. ✅ **Notification on WebView Load**: Sends notification when WebView finishes loading
2. ✅ **Notification Tap Navigation**: Tapping a notification opens the Video Player page
3. ✅ **Custom Video Controls**: Seek, skip, mute controls
4. ✅ **Progress Display**: Shows current playback time and duration

## 🔧 Configuration

### Notification Permissions
The app requests notification permissions on first launch. Make sure to grant permissions for notifications to work properly.

### Video URL
The HLS video URL is set to:
```
https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8
```

You can change this in `src/screens/VideoPlayerScreen.js`.

### WebView URL
The WebView loads:
```
https://expo.dev
```

You can change this in `src/screens/WebViewScreen.js`.

## 📱 Testing

### Local Testing
- Run `npm start` and use Expo Go app
- Test on both iOS and Android devices
- Verify notifications work (may require device permissions)

### Expo Go Compatibility
✅ The app is fully compatible with Expo Go
- All dependencies use Expo SDK modules
- No custom native code required
- Works on both iOS and Android

## 🐛 Troubleshooting

1. **Notifications not working**: 
   - Check device notification permissions
   - Ensure app has notification permissions enabled in device settings

2. **Video not playing**:
   - Check internet connection
   - Verify the HLS URL is accessible
   - Try a different HLS stream URL

3. **WebView not loading**:
   - Check internet connection
   - Verify the URL is accessible
   - Check console for errors

## 📝 Notes

- The app uses Expo SDK 54
- All features work in Expo Go without custom native builds
- Notifications require device permissions
- Video playback requires internet connection for HLS streams

## 👨‍💻 Development

### Adding New Features
- Screens go in `src/screens/`
- Styles use NativeWind classes
- Navigation is handled in `App.js`

### Code Quality
- Clean component structure
- Proper error handling
- Comments for complex logic
- Consistent code style

## 📄 License

This project is created for educational/assignment purposes.
