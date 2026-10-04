import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function TodoItem({ todo, onToggle, onEdit, onDelete }) {
  const { theme } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleToggle = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.85, duration: 80, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1.15, bounciness: 12, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, bounciness: 4, useNativeDriver: true }),
    ]).start();
    onToggle(todo._id);
  };

  const priorityColor = {
    high: { bg: '#450a0a', text: '#f87171', border: '#991b1b', label: 'HIGH 🔴' },
    medium: { bg: '#451a03', text: '#fbbf24', border: '#92400e', label: 'MEDIUM 🟡' },
    low: { bg: '#064e3b', text: '#34d399', border: '#065f46', label: 'LOW 🟢' },
  }[todo.priority || 'medium'];

  return (
    <Animated.View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
      <Pressable onPress={handleToggle} style={styles.check}>
        <Animated.View
          style={[
            styles.checkbox,
            todo.completed && styles.checked,
            { transform: [{ scale: scaleAnim }] },
          ]}
        >
          {todo.completed ? <Text style={styles.checkmark}>✓</Text> : null}
        </Animated.View>
      </Pressable>

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={[styles.title, { color: theme.text }, todo.completed && styles.completed]}>
            {todo.title}
          </Text>
        </View>

        {todo.description ? (
          <Text style={[styles.description, { color: theme.textSecondary }]}>
            {todo.description}
          </Text>
        ) : null}

        <View style={styles.badgesRow}>
          {/* Priority Badge */}
          <View style={[styles.badge, { backgroundColor: priorityColor.bg, borderColor: priorityColor.border }]}>
            <Text style={[styles.badgeText, { color: priorityColor.text }]}>{priorityColor.label}</Text>
          </View>

          {/* Due Date Badge if present */}
          {todo.dueDate ? (
            <View style={[styles.badge, styles.dateBadge]}>
              <Text style={styles.dateBadgeText}>📅 {todo.dueDate}</Text>
            </View>
          ) : null}
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable onPress={() => onEdit(todo)} style={styles.actionBtn}>
          <Text style={styles.editIcon}>✏️</Text>
        </Pressable>
        <Pressable onPress={() => onDelete(todo)} style={styles.actionBtn}>
          <Text style={styles.deleteIcon}>🗑️</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  check: {
    paddingRight: 14,
    paddingTop: 3,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderWidth: 2,
    borderColor: '#6366f1',
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  checked: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  checkmark: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 16.5,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  completed: {
    textDecorationLine: 'line-through',
    opacity: 0.5,
  },
  description: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    gap: 8,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  dateBadge: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
  },
  dateBadgeText: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '700',
  },
  actions: {
    marginLeft: 10,
    gap: 8,
  },
  actionBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editIcon: {
    fontSize: 15,
  },
  deleteIcon: {
    fontSize: 15,
  },
});
