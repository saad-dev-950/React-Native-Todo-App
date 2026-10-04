import React, { useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

// Crazy Animated Eye Component with Pupil Blink & Scale Effect
function CrazyEyeIcon({ isVisible, onPress }) {
  const eyeScale = useRef(new Animated.Value(1)).current;
  const pupilScale = useRef(new Animated.Value(1)).current;

  const handleToggle = () => {
    // Crazy Blink & Spring sequence
    Animated.sequence([
      Animated.timing(eyeScale, {
        toValue: 0.4,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(eyeScale, {
        toValue: 1.25,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.spring(eyeScale, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.sequence([
      Animated.timing(pupilScale, {
        toValue: 0.1,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.spring(pupilScale, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();

    onPress();
  };

  return (
    <Pressable onPress={handleToggle} style={styles.eyePressable}>
      <Animated.View
        style={[
          styles.crazyEyeBadge,
          isVisible && styles.crazyEyeBadgeActive,
          { transform: [{ scale: eyeScale }] },
        ]}
      >
        <Animated.Text
          style={[
            styles.crazyEyeText,
            { transform: [{ scale: pupilScale }] },
          ]}
        >
          {isVisible ? '🔓' : '🔒'}
        </Animated.Text>
      </Animated.View>
    </Pressable>
  );
}

export default function CustomInput({ label, error, secureTextEntry, ...props }) {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const focusAnim = useRef(new Animated.Value(0)).current;

  const isPassword = Boolean(secureTextEntry);

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(focusAnim, {
      toValue: 1,
      duration: 220,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.timing(focusAnim, {
      toValue: 0,
      duration: 220,
      useNativeDriver: false,
    }).start();
  };

  const borderColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [error ? '#ef4444' : '#334155', '#6366f1'],
  });

  const shadowOpacity = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.05, 0.4],
  });

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <Animated.View
        style={[
          styles.inputWrapper,
          { borderColor, shadowOpacity },
          isFocused && styles.inputWrapperFocused,
          error && styles.errorWrapper,
        ]}
      >
        <TextInput
          style={styles.input}
          placeholderTextColor="#64748b"
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={isPassword && !isPasswordVisible}
          {...props}
        />
        {isPassword && (
          <CrazyEyeIcon
            isVisible={isPasswordVisible}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          />
        )}
      </Animated.View>
      {error ? <Text style={styles.error}>⚠️ {error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
    fontSize: 13.5,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.8,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 3,
    backgroundColor: '#0f172a',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 4,
  },
  inputWrapperFocused: {
    backgroundColor: '#1e1b4b',
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 15.5,
    color: '#f8fafc',
    fontWeight: '600',
  },
  crazyEyePressable: {
    padding: 4,
  },
  crazyEyeBadge: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#1e293b',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  crazyEyeBadgeActive: {
    backgroundColor: '#4338ca',
    borderColor: '#818cf8',
    shadowColor: '#818cf8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 6,
  },
  crazyEyeText: {
    fontSize: 18,
  },
  errorWrapper: {
    borderColor: '#ef4444',
    backgroundColor: '#450a0a',
  },
  error: {
    color: '#f87171',
    marginTop: 6,
    fontSize: 12.5,
    fontWeight: '600',
  },
});
