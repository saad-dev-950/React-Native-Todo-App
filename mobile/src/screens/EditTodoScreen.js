import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { updateTodo } from '../services/todoService';

function apiMessage(error) {
  return error?.response?.data?.message || 'Unable to connect to the server.';
}

export default function EditTodoScreen({ route, navigation }) {
  const { todo } = route.params;
  const { theme } = useTheme();
  const { showToast } = useToast();

  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description || '');
  const [completed, setCompleted] = useState(todo.completed);
  const [priority, setPriority] = useState(todo.priority || 'medium');
  const [dueDate, setDueDate] = useState(todo.dueDate || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    if (!title.trim()) {
      setError('Task title is required.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await updateTodo(todo._id, {
        title: title.trim(),
        description: description.trim(),
        completed,
        priority,
        dueDate: dueDate.trim(),
      });
      showToast('Task updated successfully! ✨', 'success');
      navigation.goBack();
    } catch (requestError) {
      showToast(apiMessage(requestError), 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.bg }]}>
      <Text style={[styles.heading, { color: theme.text }]}>Edit Task ✏️</Text>

      <CustomInput
        label="Task Title *"
        value={title}
        onChangeText={setTitle}
        placeholder="Task title"
        error={error}
      />

      <CustomInput
        label="Description"
        value={description}
        onChangeText={setDescription}
        placeholder="Optional details..."
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
        label="Due Date"
        value={dueDate}
        onChangeText={setDueDate}
        placeholder="e.g. 2026-10-15"
      />

      <View style={styles.switchRow}>
        <Text style={[styles.statusLabel, { color: theme.text }]}>Mark Completed</Text>
        <Switch
          value={completed}
          onValueChange={setCompleted}
          trackColor={{ false: '#334155', true: '#10b981' }}
          thumbColor="#ffffff"
        />
      </View>

      <View style={styles.actionsContainer}>
        <CustomButton title="Save Changes 💾" onPress={handleSave} loading={loading} />
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
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 14,
    paddingHorizontal: 4,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
  actionsContainer: {
    marginTop: 10,
    gap: 4,
  },
});
