/**
 * VideoPlayerScreen Component
 * 
 * A YouTube-like video player with custom controls:
 * - Single tap: Toggle play/pause with overlay
 * - Double tap left: Seek backward 10 seconds
 * - Double tap right: Seek forward 10 seconds
 * - Draggable seekbar for precise seeking
 * - Fullscreen orientation toggle
 * - Buffering loader indicator
 * - Responsive design for portrait and landscape modes
 */

import React, { useState, useRef } from 'react';
import { View, StyleSheet, Dimensions, Pressable, PanResponder, ActivityIndicator } from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { useNavigation } from '@react-navigation/native';
import { Text, IconButton } from 'react-native-paper';
import { moderateScale, moderateVerticalScale } from 'react-native-size-matters';
import * as ScreenOrientation from 'expo-screen-orientation';

// Constants
const HLS_URL = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';
const DOUBLE_TAP_DELAY = 300; // milliseconds
const PLAY_PAUSE_OVERLAY_DURATION = 2500; // milliseconds
const SEEK_INDICATOR_DURATION = 1000; // milliseconds
const PLAYER_UPDATE_INTERVAL = 100; // milliseconds

export default function VideoPlayerScreen() {
  const navigation = useNavigation();

  // ==================== State Management ====================
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showPlayPauseOverlay, setShowPlayPauseOverlay] = useState(false);
  const [seekbarValue, setSeekbarValue] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showSeekIndicator, setShowSeekIndicator] = useState(false);
  const [seekDirection, setSeekDirection] = useState(null); // 'forward' or 'backward'
  const [screenData, setScreenData] = useState(Dimensions.get('window'));
  const [seekbarPosition, setSeekbarPosition] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);

  // ==================== Refs ====================
  const lastTapRef = useRef(null);
  const overlayTimeoutRef = useRef(null);
  const seekIndicatorTimeoutRef = useRef(null);
  const seekbarTrackRef = useRef(null);

  // ==================== Video Player Setup ====================
  const player = useVideoPlayer(HLS_URL);
  const seekbarPadding = moderateScale(16);
  const seekbarWidth = screenData.width - (seekbarPadding * 2);

  // ==================== Effects ====================

  /**
   * Configure video player settings on mount
   */
  React.useEffect(() => {
    if (!player) return;
    player.loop = false;
    player.muted = isMuted;
  }, [player, isMuted]);

  /**
   * Auto-play video when player is ready
   */
  React.useEffect(() => {
    if (player) {
      player.play();
      setIsPlaying(true);
    }
  }, [player]);

  /**
   * Update player state and seekbar position at regular intervals
   */
  React.useEffect(() => {
    if (!player) return;

    const interval = setInterval(() => {
      if (player && !isDragging) {
        const time = player.currentTime || 0;
        const dur = player.duration || 0;
        setCurrentTime(time);
        setDuration(dur);
        setIsPlaying(player.playing || false);

        // Check buffering status
        const status = player.status || 'idle';
        setIsBuffering(status === 'loading');

        // Update seekbar position based on video progress
        if (dur > 0) {
          const progress = time / dur;
          setSeekbarValue(progress);
          setSeekbarPosition(progress * seekbarWidth);
        }
      }
    }, PLAYER_UPDATE_INTERVAL);

    return () => clearInterval(interval);
  }, [player, isDragging, seekbarWidth]);

  /**
   * Auto-hide play/pause overlay after specified duration
   */
  React.useEffect(() => {
    if (showPlayPauseOverlay) {
      if (overlayTimeoutRef.current) {
        clearTimeout(overlayTimeoutRef.current);
      }
      overlayTimeoutRef.current = setTimeout(() => {
        setShowPlayPauseOverlay(false);
      }, PLAY_PAUSE_OVERLAY_DURATION);
    }
    return () => {
      if (overlayTimeoutRef.current) {
        clearTimeout(overlayTimeoutRef.current);
      }
    };
  }, [showPlayPauseOverlay]);

  /**
   * Auto-hide seek indicator after specified duration
   */
  React.useEffect(() => {
    if (showSeekIndicator) {
      if (seekIndicatorTimeoutRef.current) {
        clearTimeout(seekIndicatorTimeoutRef.current);
      }
      seekIndicatorTimeoutRef.current = setTimeout(() => {
        setShowSeekIndicator(false);
        setSeekDirection(null);
      }, SEEK_INDICATOR_DURATION);
    }
    return () => {
      if (seekIndicatorTimeoutRef.current) {
        clearTimeout(seekIndicatorTimeoutRef.current);
      }
    };
  }, [showSeekIndicator]);

  /**
   * Listen to screen dimension changes for orientation updates
   */
  React.useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenData(window);
    });

    return () => {
      subscription?.remove();
    };
  }, []);

  /**
   * Restore default orientation when leaving the screen
   */
  React.useEffect(() => {
    return () => {
      ScreenOrientation.unlockAsync().catch(console.error);
    };
  }, []);

  // ==================== Video Control Functions ====================

  /**
   * Toggle video play/pause state
   */
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

  /**
   * Toggle mute/unmute state
   */
  const toggleMute = () => {
    if (!player) return;
    const newMutedState = !isMuted;
    player.muted = newMutedState;
    setIsMuted(newMutedState);
  };

  /**
   * Seek video forward by 10 seconds
   */
  const seekForward = () => {
    if (!player) return;
    const newPosition = Math.min(
      player.currentTime + 10,
      player.duration
    );
    player.currentTime = newPosition;
    setCurrentTime(newPosition);
  };

  /**
   * Seek video backward by 10 seconds
   */
  const seekBackward = () => {
    if (!player) return;
    const newPosition = Math.max(player.currentTime - 10, 0);
    player.currentTime = newPosition;
    setCurrentTime(newPosition);
  };

  /**
   * Format seconds into MM:SS format
   * @param {number} seconds - Time in seconds
   * @returns {string} Formatted time string
   */
  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const totalSeconds = Math.floor(seconds);
    const minutes = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  /**
   * Calculate video progress percentage
   * @returns {number} Progress value between 0 and 1
   */
  const getProgress = () => {
    if (!duration || !currentTime) return 0;
    return currentTime / duration;
  };

  /**
   * Toggle screen orientation between portrait and landscape
   */
  const toggleOrientation = async () => {
    try {
      const currentOrientation = await ScreenOrientation.getOrientationAsync();
      const isLandscape =
        currentOrientation === ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
        currentOrientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT;

      if (isLandscape) {
        // Switch to portrait
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
      } else {
        // Switch to landscape
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
      }
    } catch (error) {
      console.error('Error toggling orientation:', error);
    }
  };

  // ==================== Touch Event Handlers ====================

  /**
   * Handle single tap on video - show play/pause overlay and toggle playback
   */
  const handleSingleTap = () => {
    setShowPlayPauseOverlay(true);
    togglePlayPause();
  };

  /**
   * Handle double tap on video - seek forward or backward based on tap position
   * @param {Object} event - Touch event object
   */
  const handleDoubleTap = (event) => {
    const { locationX } = event.nativeEvent;
    const videoWidth = screenData.width;
    const isLeftHalf = locationX < videoWidth / 2;

    if (isLeftHalf) {
      seekBackward();
      setSeekDirection('backward');
    } else {
      seekForward();
      setSeekDirection('forward');
    }
    setShowSeekIndicator(true);
  };

  /**
   * Handle tap on video area - detect single vs double tap
   * @param {Object} event - Touch event object
   */
  const handleVideoTap = (event) => {
    const now = Date.now();

    if (lastTapRef.current && (now - lastTapRef.current < DOUBLE_TAP_DELAY)) {
      // Double tap detected
      handleDoubleTap(event);
      lastTapRef.current = null;
    } else {
      // Single tap - wait to see if it's a double tap
      lastTapRef.current = now;
      setTimeout(() => {
        if (lastTapRef.current === now) {
          handleSingleTap();
          lastTapRef.current = null;
        }
      }, DOUBLE_TAP_DELAY);
    }
  };

  /**
   * Handle seekbar press - seek to tapped position
   * @param {Object} event - Touch event object
   */
  const handleSeekbarPress = (event) => {
    if (seekbarTrackRef.current) {
      seekbarTrackRef.current.measure((x, y, trackWidth, trackHeight, pageX, pageY) => {
        const touchX = event.nativeEvent.pageX - pageX;
        const newProgress = Math.max(0, Math.min(1, touchX / trackWidth));
        setSeekbarValue(newProgress);
        setSeekbarPosition(newProgress * trackWidth);

        if (player && duration > 0) {
          const newTime = newProgress * duration;
          player.currentTime = newTime;
          setCurrentTime(newTime);
        }
      });
    }
  };

  /**
   * Pan responder for draggable seekbar functionality
   */
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        setIsDragging(true);
        if (seekbarTrackRef.current) {
          seekbarTrackRef.current.measure((x, y, trackWidth, trackHeight, pageX, pageY) => {
            const touchX = evt.nativeEvent.pageX - pageX;
            const newProgress = Math.max(0, Math.min(1, touchX / trackWidth));
            setSeekbarValue(newProgress);
            setSeekbarPosition(newProgress * trackWidth);
          });
        }
      },
      onPanResponderMove: (evt, gestureState) => {
        if (seekbarTrackRef.current) {
          seekbarTrackRef.current.measure((x, y, trackWidth, trackHeight, pageX, pageY) => {
            const touchX = evt.nativeEvent.pageX - pageX;
            const newProgress = Math.max(0, Math.min(1, touchX / trackWidth));
            setSeekbarValue(newProgress);
            setSeekbarPosition(newProgress * trackWidth);
          });
        }
      },
      onPanResponderRelease: () => {
        if (player && duration > 0) {
          const newTime = seekbarValue * duration;
          player.currentTime = newTime;
          setCurrentTime(newTime);
        }
        setIsDragging(false);
      },
    })
  ).current;

  // ==================== Render ====================

  return (
    <View style={styles.container}>
      {/* Header with back button */}
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          iconColor="#fff"
          size={moderateScale(28)}
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        />
        <Text variant="titleLarge" style={styles.headerTitle}>
          HLS Video Player
        </Text>
        <View style={styles.placeholder} />
      </View>

      {/* Video Player Container */}
      <View style={styles.videoContainer}>
        <Pressable style={styles.videoPressable} onPress={handleVideoTap}>
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

          {/* Play/Pause Overlay - appears on single tap */}
          {showPlayPauseOverlay && (
            <View style={styles.playPauseOverlay}>
              <IconButton
                icon={isPlaying ? 'pause' : 'play'}
                iconColor="#fff"
                size={moderateScale(80)}
                style={styles.playPauseIcon}
                onPress={togglePlayPause}
              />
            </View>
          )}

          {/* Seek Indicator Overlay - shows +10 or -10 on double tap */}
          {showSeekIndicator && (
            <View
              style={[
                styles.seekIndicatorOverlay,
                seekDirection === 'forward' ? styles.seekIndicatorRight : styles.seekIndicatorLeft
              ]}
            >
              <View style={styles.seekIndicatorContainer}>
                {seekDirection === 'forward' ? (
                  <Text style={styles.seekIndicatorText}>+10 {'>'}</Text>
                ) : (
                  <Text style={styles.seekIndicatorText}>{'<'} -10</Text>
                )}
              </View>
            </View>
          )}

          {/* Buffering Loader Overlay */}
          {isBuffering && (
            <View style={styles.bufferingOverlay}>
              <ActivityIndicator size="large" color="#fff" />
              <Text style={styles.bufferingText}>Buffering...</Text>
            </View>
          )}
        </Pressable>

        {/* Draggable Seekbar with controls */}
        <View style={styles.seekbarContainer}>
          {/* Fullscreen button header */}
          <View style={styles.seekbarHeader}>
            <View style={styles.seekbarHeaderLeft} />
            <IconButton
              icon="fullscreen"
              iconColor="#fff"
              size={moderateScale(24)}
              onPress={toggleOrientation}
              style={styles.fullscreenButton}
            />
          </View>

          {/* Seekbar track with progress and thumb */}
          <Pressable
            ref={seekbarTrackRef}
            style={styles.seekbarTrack}
            onPress={handleSeekbarPress}
            {...panResponder.panHandlers}
          >
            <View
              style={[
                styles.seekbarProgress,
                {
                  width: seekbarPosition,
                },
              ]}
            />
            <View
              style={[
                styles.seekbarThumb,
                {
                  left: Math.max(0, seekbarPosition - moderateScale(8)),
                },
              ]}
            />
          </Pressable>

          {/* Time display */}
          <View style={styles.timeContainer}>
            <Text variant="bodySmall" style={styles.timeText}>
              {formatTime(isDragging ? seekbarValue * duration : currentTime)}
            </Text>
            <Text variant="bodySmall" style={styles.timeText}>
              {formatTime(duration)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

// ==================== Styles ====================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: moderateVerticalScale(50),
    paddingHorizontal: moderateScale(8),
    paddingBottom: moderateVerticalScale(8),
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
    width: moderateScale(48),
  },
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  videoPressable: {
    width: '100%',
    height: '50%',
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  playPauseOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  playPauseIcon: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  seekIndicatorOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  seekIndicatorLeft: {
    left: moderateScale(20),
    alignItems: 'flex-start',
  },
  seekIndicatorRight: {
    right: moderateScale(20),
    alignItems: 'flex-end',
  },
  seekIndicatorContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateVerticalScale(8),
    borderRadius: moderateScale(6),
  },
  seekIndicatorText: {
    color: '#fff',
    fontSize: moderateScale(16),
    fontWeight: 'bold',
  },
  bufferingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bufferingText: {
    color: '#fff',
    fontSize: moderateScale(14),
    marginTop: moderateVerticalScale(12),
  },
  seekbarContainer: {
    width: '100%',
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateVerticalScale(12),
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  seekbarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: moderateVerticalScale(8),
  },
  seekbarHeaderLeft: {
    flex: 1,
  },
  fullscreenButton: {
    margin: 0,
    padding: 0,
  },
  seekbarTrack: {
    height: moderateVerticalScale(4),
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: moderateScale(2),
    position: 'relative',
    marginBottom: moderateVerticalScale(8),
    justifyContent: 'center',
  },
  seekbarProgress: {
    height: moderateVerticalScale(4),
    backgroundColor: '#6200ee',
    borderRadius: moderateScale(2),
    position: 'absolute',
    left: 0,
    top: 0,
  },
  seekbarThumb: {
    width: moderateScale(16),
    height: moderateScale(16),
    borderRadius: moderateScale(8),
    backgroundColor: '#6200ee',
    position: 'absolute',
    top: moderateVerticalScale(-6),
    left: 0,
    zIndex: 1,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    color: '#fff',
    fontSize: moderateScale(12),
  },
});
