import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { createTodo } from '../services/todoService';
import { scheduleTaskNotification } from '../services/notificationService';

function apiMessage(error) {
  return error?.response?.data?.message || 'Unable to connect to the server.';
}

export default function AddTodoScreen({ navigation }) {
  const { theme } = useTheme();
  const { showToast } = useToast();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleAdd() {
    if (!title.trim()) {
      setError('Task title is required.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await createTodo({
        title: title.trim(),
        description: description.trim(),
        priority,
        dueDate: dueDate.trim(),
      });
      // Trigger notification reminder
      scheduleTaskNotification(title.trim(), dueDate.trim());
      showToast('Task created & notification set! ⏰🎉', 'success');
      navigation.goBack();
    } catch (requestError) {
      showToast(apiMessage(requestError), 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.bg }]}>
      <Text style={[styles.heading, { color: theme.text }]}>Create a New Task 🚀</Text>

      <CustomInput
        label="Task Title *"
        value={title}
        onChangeText={setTitle}
        placeholder="e.g. Finish React Native project"
        error={error}
      />

      <CustomInput
        label="Description (Optional)"
        value={description}
        onChangeText={setDescription}
        placeholder="Add details or notes..."
        multiline
        numberOfLines={4}
      />

      {/* Priority Selector */}
      <Text style={[styles.label, { color: theme.textSecondary }]}>PRIORITY LEVEL</Text>
      <View style={styles.priorityRow}>
        {[
          { key: 'low', label: 'Low 🟢', activeBg: '#064e3b', activeBorder: '#10b981' },
          { key: 'medium', label: 'Medium 🟡', activeBg: '#451a03', activeBorder: '#f59e0b' },
          { key: 'high', label: 'High 🔴', activeBg: '#450a0a', activeBorder: '#ef4444' },
        ].map((p) => (
          <Pressable
            key={p.key}
            onPress={() => setPriority(p.key)}
            style={[
              styles.priorityBtn,
              { backgroundColor: theme.card, borderColor: theme.cardBorder },
              priority === p.key && { backgroundColor: p.activeBg, borderColor: p.activeBorder },
            ]}
          >
            <Text
              style={[
                styles.priorityText,
                { color: theme.textSecondary },
                priority === p.key && { color: '#ffffff', fontWeight: '800' },
              ]}
            >
              {p.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <CustomInput
        label="Due Date (Optional)"
        value={dueDate}
        onChangeText={setDueDate}
        placeholder="e.g. Today, Tomorrow, or 2026-10-15"
      />

      <View style={styles.actionsContainer}>
        <CustomButton title="Create Task ⚡" onPress={handleAdd} loading={loading} />
        <CustomButton
          title="Cancel"
          onPress={() => navigation.goBack()}
          variant="secondary"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 22,
    flexGrow: 1,
  },
  heading: {
    fontSize: 26,
    fontWeight: '900',
    marginBottom: 22,
    letterSpacing: -0.5,
  },
  label: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 10,
    marginTop: 4,
  },
  priorityRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  priorityBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priorityText: {
    fontSize: 13.5,
    fontWeight: '700',
  },
  actionsContainer: {
    marginTop: 14,
    gap: 4,
  },
});
