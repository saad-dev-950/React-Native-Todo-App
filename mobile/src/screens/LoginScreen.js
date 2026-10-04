import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';
import { useAuth } from '../context/AuthContext';

function apiMessage(error) {
  return error?.response?.data?.message || 'Unable to connect to the server. Please check your connection.';
}

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Crazy Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(45)).current;
  const logoRotate = useRef(new Animated.Value(0)).current;
  const pulseGlow = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    // Entrance Sequence
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        speed: 10,
        bounciness: 7,
        useNativeDriver: true,
      }),
      Animated.spring(logoRotate, {
        toValue: 1,
        speed: 8,
        bounciness: 12,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous Background Pulse Animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseGlow, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseGlow, {
          toValue: 0.6,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const logoTransform = logoRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['-15deg', '0deg'],
  });

  function validate() {
    const next = {};
    if (!email.trim()) next.email = 'Email is required.';
    if (!password) next.password = 'Password is required.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleLogin() {
    if (!validate()) return;
    setLoading(true);
    try {
      await login({ email: email.trim(), password });
    } catch (error) {
      Alert.alert('Login failed', apiMessage(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor="#090d16" />

      {/* Crazy Glowing Background Orbs */}
      <Animated.View style={[styles.bgOrb1, { opacity: pulseGlow, transform: [{ scale: pulseGlow }] }]} />
      <Animated.View style={[styles.bgOrb2, { opacity: pulseGlow }]} />

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Animated Header Section */}
        <Animated.View style={[styles.headerSection, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <Animated.View style={[styles.logoBadge, { transform: [{ rotate: logoTransform }] }]}>
            <Text style={styles.logoBadgeText}>🚀</Text>
          </Animated.View>

          <View style={styles.pillTag}>
            <Text style={styles.pillTagText}>✨ NEXT-GEN TODO APP</Text>
          </View>

          <Text style={styles.heading}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to manage your tasks with crazy speed.</Text>
        </Animated.View>

        {/* Animated Dark Glass Form Card */}
        <Animated.View style={[styles.formCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <CustomInput
            label="Email Address"
            value={email}
            onChangeText={setEmail}
            placeholder="student@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
          />

          <CustomInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            secureTextEntry
            error={errors.password}
          />

          <View style={styles.buttonContainer}>
            <CustomButton title="SIGN IN ⚡" onPress={handleLogin} loading={loading} />
          </View>

          <Pressable onPress={() => navigation.navigate('Register')} style={styles.linkWrapper}>
            <Text style={styles.linkText}>
              Don't have an account? <Text style={styles.linkBold}>Create One Free</Text>
            </Text>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090d16',
  },
  bgOrb1: {
    position: 'absolute',
    top: -80,
    right: -60,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: '#6366f1',
    opacity: 0.25,
    blurRadius: 40,
  },
  bgOrb2: {
    position: 'absolute',
    bottom: -60,
    left: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#ec4899',
    opacity: 0.15,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 22,
    paddingVertical: 36,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 26,
  },
  logoBadge: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: '#1e1b4b',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#818cf8',
    shadowColor: '#818cf8',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 12,
  },
  logoBadgeText: {
    fontSize: 34,
  },
  pillTag: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 10,
  },
  pillTagText: {
    color: '#818cf8',
    fontSize: 11.5,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  heading: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 14.5,
    marginTop: 6,
    textAlign: 'center',
    paddingHorizontal: 16,
    lineHeight: 22,
  },
  formCard: {
    backgroundColor: '#0f172a',
    borderRadius: 28,
    padding: 24,
    borderWidth: 1.5,
    borderColor: '#1e293b',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 12,
  },
  buttonContainer: {
    marginTop: 10,
  },
  linkWrapper: {
    marginTop: 20,
    alignItems: 'center',
    paddingVertical: 6,
  },
  linkText: {
    color: '#94a3b8',
    fontSize: 14,
  },
  linkBold: {
    color: '#818cf8',
    fontWeight: '800',
  },
});
