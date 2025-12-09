import React, { useState, useRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { useNavigation } from '@react-navigation/native';
import { Button, Card, Text, IconButton, ProgressBar } from 'react-native-paper';

const { width, height } = Dimensions.get('window');

export default function VideoPlayerScreen() {
  const navigation = useNavigation();
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const HLS_URL = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';

  const player = useVideoPlayer(HLS_URL);

  // Configure player on mount
  React.useEffect(() => {
    if (!player) return;
    player.loop = false;
    player.muted = isMuted;
  }, [player, isMuted]);

  // Auto-play on mount
  React.useEffect(() => {
    if (player) {
      player.play();
      setIsPlaying(true);
    }
  }, [player]);

  // Update state from player
  React.useEffect(() => {
    if (!player) return;

    const interval = setInterval(() => {
      if (player) {
        setCurrentTime(player.currentTime || 0);
        setDuration(player.duration || 0);
        setIsPlaying(player.playing || false);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [player]);

  const togglePlayPause = () => {
    if (!player) return;
    if (player.playing) {
      player.pause();
      setIsPlaying(false);
    } else {
      player.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!player) return;
    const newMutedState = !isMuted;
    player.muted = newMutedState;
    setIsMuted(newMutedState);
  };

  const seekForward = () => {
    if (!player) return;
    const newPosition = Math.min(
      player.currentTime + 10,
      player.duration
    );
    player.currentTime = newPosition;
    setCurrentTime(newPosition);
  };

  const seekBackward = () => {
    if (!player) return;
    const newPosition = Math.max(player.currentTime - 10, 0);
    player.currentTime = newPosition;
    setCurrentTime(newPosition);
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const totalSeconds = Math.floor(seconds);
    const minutes = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    if (!duration || !currentTime) return 0;
    return currentTime / duration;
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          iconColor="#fff"
          size={28}
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        />
        <Text variant="titleLarge" style={styles.headerTitle}>
          HLS Video Player
        </Text>
        <View style={styles.placeholder} />
      </View>

      {/* Video Player */}
      <View style={styles.videoContainer}>
        {player && (
          <VideoView
            player={player}
            style={styles.video}
            allowsFullscreen={true}
            allowsPictureInPicture={true}
            contentFit="contain"
            nativeControls={false}
          />
        )}
      </View>

      {/* Controls Card */}
      <Card style={styles.controlsCard} mode="elevated">
        <Card.Content>
          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <ProgressBar progress={getProgress()} color="#6200ee" style={styles.progressBar} />
            <View style={styles.timeContainer}>
              <Text variant="bodySmall" style={styles.timeText}>
                {formatTime(currentTime)}
              </Text>
              <Text variant="bodySmall" style={styles.timeText}>
                {formatTime(duration)}
              </Text>
            </View>
          </View>

          {/* Main Controls */}
          <View style={styles.mainControls}>
            <Button
              mode="contained-tonal"
              onPress={seekBackward}
              icon="rewind-10"
              style={styles.controlButton}
              buttonColor="#e0e0e0"
              textColor="#000"
            >
              10s
            </Button>

            <Button
              mode="contained"
              onPress={togglePlayPause}
              icon={isPlaying ? 'pause' : 'play'}
              style={[styles.controlButton, styles.playButton]}
              buttonColor="#6200ee"
              textColor="#fff"
              contentStyle={styles.playButtonContent}
            >
              {isPlaying ? 'Pause' : 'Play'}
            </Button>

            <Button
              mode="contained-tonal"
              onPress={seekForward}
              icon="fast-forward-10"
              style={styles.controlButton}
              buttonColor="#e0e0e0"
              textColor="#000"
            >
              10s
            </Button>
          </View>

          {/* Secondary Controls */}
          <View style={styles.secondaryControls}>
            <Button
              mode={isMuted ? 'contained' : 'outlined'}
              onPress={toggleMute}
              icon={isMuted ? 'volume-off' : 'volume-high'}
              style={styles.secondaryButton}
              buttonColor={isMuted ? '#f44336' : undefined}
              textColor={isMuted ? '#fff' : '#6200ee'}
            >
              {isMuted ? 'Muted' : 'Sound'}
            </Button>
          </View>

          {/* Video Info */}
          <Card style={styles.infoCard} mode="outlined">
            <Card.Content>
              <Text variant="labelMedium" style={styles.infoLabel}>
                Video Status
              </Text>
              <Text variant="bodySmall" style={styles.infoText}>
                {player
                  ? `Playing HLS stream • ${isPlaying ? 'Playing' : 'Paused'}`
                  : 'Loading video...'}
              </Text>
            </Card.Content>
          </Card>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 8,
    paddingBottom: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  backButton: {
    margin: 0,
  },
  headerTitle: {
    color: '#fff',
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 48,
  },
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  video: {
    width: width,
    height: height * 0.5,
  },
  controlsCard: {
    margin: 16,
    marginTop: 8,
    maxHeight: height * 0.4,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    marginBottom: 8,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    color: '#666',
  },
  mainControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 16,
  },
  controlButton: {
    minWidth: 100,
  },
  playButton: {
    minWidth: 120,
  },
  playButtonContent: {
    paddingVertical: 8,
  },
  secondaryControls: {
    marginBottom: 16,
  },
  secondaryButton: {
    width: '100%',
  },
  infoCard: {
    marginTop: 8,
  },
  infoLabel: {
    marginBottom: 4,
    color: '#6200ee',
    fontWeight: 'bold',
  },
  infoText: {
    color: '#666',
  },
});
