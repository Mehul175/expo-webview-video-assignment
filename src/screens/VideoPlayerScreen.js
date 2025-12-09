import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

export default function VideoPlayerScreen() {
  const navigation = useNavigation();
  const videoRef = useRef(null);
  const [status, setStatus] = useState({});
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const HLS_URL = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';

  const togglePlayPause = async () => {
    if (status.isPlaying) {
      await videoRef.current?.pauseAsync();
    } else {
      await videoRef.current?.playAsync();
    }
  };

  const toggleMute = async () => {
    const newMutedState = !isMuted;
    await videoRef.current?.setIsMutedAsync(newMutedState);
    setIsMuted(newMutedState);
  };

  const seekForward = async () => {
    const currentPosition = status.positionMillis || 0;
    const newPosition = currentPosition + 10000; // 10 seconds forward
    await videoRef.current?.setPositionAsync(newPosition);
  };

  const seekBackward = async () => {
    const currentPosition = status.positionMillis || 0;
    const newPosition = Math.max(0, currentPosition - 10000); // 10 seconds backward
    await videoRef.current?.setPositionAsync(newPosition);
  };

  return (
    <View className="flex-1 bg-black">
      <View className="flex-1 justify-center">
        <Video
          ref={videoRef}
          style={styles.video}
          source={{ uri: HLS_URL }}
          useNativeControls={false}
          resizeMode={ResizeMode.CONTAIN}
          isLooping={false}
          onPlaybackStatusUpdate={(status) => setStatus(() => status)}
        />
      </View>

      {/* Custom Controls */}
      <View className="absolute bottom-0 left-0 right-0 bg-black/70 p-4">
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity
            onPress={seekBackward}
            className="bg-white/20 p-3 rounded-full"
            activeOpacity={0.7}
          >
            <Text className="text-white font-bold text-lg">⏪ 10s</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={togglePlayPause}
            className="bg-blue-500 p-4 rounded-full"
            activeOpacity={0.8}
          >
            <Text className="text-white font-bold text-2xl">
              {status.isPlaying ? '⏸' : '▶'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={seekForward}
            className="bg-white/20 p-3 rounded-full"
            activeOpacity={0.7}
          >
            <Text className="text-white font-bold text-lg">10s ⏩</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={toggleMute}
            className="bg-white/20 px-4 py-2 rounded-lg"
            activeOpacity={0.7}
          >
            <Text className="text-white font-semibold">
              {isMuted ? '🔇 Muted' : '🔊 Sound'}
            </Text>
          </TouchableOpacity>

          <Text className="text-white text-sm">
            {status.positionMillis
              ? `${Math.floor(status.positionMillis / 1000)}s / ${
                  status.durationMillis
                    ? Math.floor(status.durationMillis / 1000)
                    : '--'
                }s`
              : 'Loading...'}
          </Text>
        </View>
      </View>

      {/* Back Button */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        className="absolute top-12 left-4 bg-black/50 p-3 rounded-full"
        activeOpacity={0.7}
      >
        <Text className="text-white font-bold text-lg">← Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  video: {
    width: width,
    height: height * 0.6,
  },
});
