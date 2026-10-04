import React, { useRef } from 'react';
import { ActivityIndicator, Animated, Pressable, StyleSheet, Text } from 'react-native';

export default function CustomButton({
  title,
  onPress,
  loading = false,
  variant = 'primary',
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.94,
      useNativeDriver: true,
      speed: 60,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 60,
      bounciness: 4,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        disabled={loading}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.button,
          variant === 'secondary' && styles.secondary,
          variant === 'danger' && styles.danger,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={variant === 'secondary' ? '#818cf8' : '#fff'} size="small" />
        ) : (
          <Text style={[styles.text, variant === 'secondary' && styles.secondaryText]}>
            {title}
          </Text>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 54,
    borderRadius: 16,
    backgroundColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginVertical: 10,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 14,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#818cf8',
  },
  secondary: {
    backgroundColor: '#1e1b4b',
    borderColor: '#3730a3',
    shadowOpacity: 0.2,
  },
  danger: {
    backgroundColor: '#ef4444',
    borderColor: '#f87171',
    shadowColor: '#ef4444',
  },
  text: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 16.5,
    letterSpacing: 0.5,
  },
  secondaryText: {
    color: '#a5b4fc',
  },
});
