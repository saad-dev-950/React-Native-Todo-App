import React, { createContext, useContext, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const slideAnim = useRef(new Animated.Value(-100)).current;

  const showToast = (message, type = 'success') => {
    setToast({ message, type });

    Animated.sequence([
      Animated.spring(slideAnim, {
        toValue: 50,
        speed: 14,
        bounciness: 8,
        useNativeDriver: true,
      }),
      Animated.delay(2600),
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setToast(null);
    });
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <Animated.View
          style={[
            styles.toastContainer,
            toast.type === 'error' && styles.toastError,
            toast.type === 'info' && styles.toastInfo,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          <Text style={styles.toastIcon}>
            {toast.type === 'error' ? '❌' : toast.type === 'info' ? 'ℹ️' : '✅'}
          </Text>
          <Text style={styles.toastText}>{toast.message}</Text>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    backgroundColor: '#10b981',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 10,
    zIndex: 9999,
  },
  toastError: {
    backgroundColor: '#ef4444',
  },
  toastInfo: {
    backgroundColor: '#6366f1',
  },
  toastIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  toastText: {
    color: '#ffffff',
    fontSize: 14.5,
    fontWeight: '700',
    flex: 1,
  },
});
