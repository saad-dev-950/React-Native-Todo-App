import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import CustomButton from '../components/CustomButton';
import TodoItem from '../components/TodoItem';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { requestNotificationPermissions } from '../services/notificationService';
import {
  deleteTodo,
  getTodos,
  toggleTodo,
} from '../services/todoService';

function apiMessage(error) {
  return error?.response?.data?.message || 'Unable to connect to the server.';
}

export default function TodoScreen({ navigation }) {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme, theme, changeAccent, activeAccent, accentsList } = useTheme();
  const { showToast } = useToast();

  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Request notifications on mount
  useEffect(() => {
    requestNotificationPermissions();
  }, []);

  const loadTodos = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError('');

    try {
      const response = await getTodos();
      setTodos(response.data);
    } catch (requestError) {
      setError(apiMessage(requestError));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadTodos();
    }, [loadTodos])
  );

  async function handleToggle(id) {
    try {
      const response = await toggleTodo(id);
      setTodos((current) =>
        current.map((todo) => (todo._id === id ? response.data : todo))
      );
      const updated = response.data;
      showToast(
        updated.completed ? 'Task marked completed! 🎉' : 'Task marked pending ⏳',
        updated.completed ? 'success' : 'info'
      );
    } catch (requestError) {
      showToast(apiMessage(requestError), 'error');
    }
  }

  function handleDelete(todo) {
    Alert.alert(
      'Delete Task',
      `Are you sure you want to delete "${todo.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTodo(todo._id);
              setTodos((current) => current.filter((item) => item._id !== todo._id));
              showToast('Task deleted successfully! 🗑️', 'info');
            } catch (requestError) {
              showToast(apiMessage(requestError), 'error');
            }
          },
        },
      ]
    );
  }

  // Filter & Search Logic
  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      if (selectedFilter === 'pending' && todo.completed) return false;
      if (selectedFilter === 'completed' && !todo.completed) return false;
      if (selectedFilter === 'high' && todo.priority !== 'high') return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = todo.title.toLowerCase().includes(q);
        const matchDesc = todo.description && todo.description.toLowerCase().includes(q);
        return matchTitle || matchDesc;
      }

      return true;
    });
  }, [todos, selectedFilter, searchQuery]);

  // Statistics
  const pendingCount = todos.filter((t) => !t.completed).length;
  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle="light-content" backgroundColor="#090d16" />

      {/* Crazy Cyberpunk Dashboard Header */}
      <View style={[styles.header, { backgroundColor: theme.headerBg }]}>
        <View style={styles.topBrandRow}>
          <View style={styles.brandBadge}>
            <Text style={styles.brandBadgeText}>⚡</Text>
          </View>
          <View style={styles.brandTextContainer}>
            <Text style={[styles.brandTitle, { color: activeAccent.primaryGlow }]}>TASKIFY CYBER</Text>
            <Text style={styles.brandSubtitle}>Realtime Task Management</Text>
          </View>
          <View style={styles.headerRightIcons}>
            <Pressable onPress={toggleTheme} style={styles.iconBtn}>
              <Text style={styles.iconText}>{isDark ? '☀️' : '🌙'}</Text>
            </Pressable>
            <Pressable onPress={logout} style={styles.logoutBtn}>
              <Text style={styles.logoutBtnText}>Logout ➔</Text>
            </Pressable>
          </View>
        </View>

        {/* User Info & Stats Bar */}
        <View style={styles.userBannerRow}>
          <View style={styles.userGreetingSection}>
            <Text style={styles.greetingText}>Welcome back, <Text style={{ color: activeAccent.primaryGlow, fontWeight: '900' }}>{user?.name || 'User'}</Text> 👋</Text>
          </View>
          <View style={styles.statsPill}>
            <Text style={styles.statsPillText}>
              🔥 {pendingCount} Pending • ✅ {completedCount} Done
            </Text>
          </View>
        </View>

        {/* Cyberpunk Accent Theme Picker Bar */}
        <View style={styles.accentPickerRow}>
          <Text style={styles.accentPickerLabel}>ACCENT THEME:</Text>
          {accentsList.map((acc) => (
            <Pressable
              key={acc.key}
              onPress={() => changeAccent(acc.key)}
              style={[
                styles.accentBtn,
                { backgroundColor: acc.primary },
                activeAccent.key === acc.key && styles.accentBtnActive,
              ]}
            >
              {activeAccent.key === acc.key ? <Text style={styles.accentCheck}>✓</Text> : null}
            </Pressable>
          ))}
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={[styles.searchBar, { backgroundColor: theme.card, borderColor: activeAccent.primary }]}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Search tasks..."
            placeholderTextColor={theme.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')}>
              <Text style={styles.clearIcon}>✖️</Text>
            </Pressable>
          )}
        </View>
      </View>

      {/* Category Filter Pills */}
      <View style={styles.filtersRow}>
        {[
          { key: 'all', label: 'All' },
          { key: 'pending', label: 'Pending ⏳' },
          { key: 'completed', label: 'Completed ✅' },
          { key: 'high', label: 'High Priority 🔴' },
        ].map((f) => (
          <Pressable
            key={f.key}
            onPress={() => setSelectedFilter(f.key)}
            style={[
              styles.filterPill,
              { backgroundColor: theme.card, borderColor: theme.cardBorder },
              selectedFilter === f.key && { backgroundColor: activeAccent.primary, borderColor: activeAccent.primaryGlow },
            ]}
          >
            <Text
              style={[
                styles.filterPillText,
                { color: theme.textSecondary },
                selectedFilter === f.key && styles.filterPillTextActive,
              ]}
            >
              {f.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Content Area */}
      <View style={styles.body}>
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={activeAccent.primaryGlow} />
            <Text style={[styles.muted, { color: theme.textSecondary }]}>Loading tasks...</Text>
          </View>
        ) : error ? (
          <View style={styles.center}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
            <CustomButton title="Retry" onPress={() => loadTodos()} />
          </View>
        ) : filteredTodos.length === 0 ? (
          <View style={styles.center}>
            <Text style={styles.emptyIcon}>🎯</Text>
            <Text style={[styles.emptyTitle, { color: theme.text }]}>No tasks found</Text>
            <Text style={[styles.muted, { color: theme.textSecondary }]}>
              {searchQuery ? 'Try another search query.' : 'Add your first task using the button below!'}
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredTodos}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TodoItem
                todo={item}
                onToggle={handleToggle}
                onEdit={(selected) => navigation.navigate('EditTodo', { todo: selected })}
                onDelete={handleDelete}
              />
            )}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => loadTodos(true)}
                tintColor={activeAccent.primaryGlow}
              />
            }
            contentContainerStyle={styles.list}
          />
        )}
      </View>

      {/* Floating Action Button (FAB) */}
      <Pressable
        onPress={() => navigation.navigate('AddTodo')}
        style={[styles.fab, { backgroundColor: activeAccent.primary, borderColor: activeAccent.primaryGlow }]}
      >
        <Text style={styles.fabIcon}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    borderBottomWidth: 1.5,
    borderBottomColor: '#1e293b',
  },
  topBrandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  brandBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#1e1b4b',
    borderWidth: 1.5,
    borderColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  brandBadgeText: {
    fontSize: 22,
  },
  brandTextContainer: {
    flex: 1,
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1,
  },
  brandSubtitle: {
    color: '#64748b',
    fontSize: 11.5,
    fontWeight: '600',
  },
  headerRightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 16,
  },
  logoutBtn: {
    backgroundColor: '#450a0a',
    borderColor: '#991b1b',
    borderWidth: 1.2,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  logoutBtnText: {
    color: '#f87171',
    fontWeight: '800',
    fontSize: 12,
  },
  userBannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    backgroundColor: '#0f172a',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  userGreetingSection: {
    flex: 1,
  },
  greetingText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  statsPill: {
    backgroundColor: '#1e1b4b',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#3730a3',
  },
  statsPillText: {
    color: '#a5b4fc',
    fontSize: 11.5,
    fontWeight: '800',
  },
  accentPickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  accentPickerLabel: {
    color: '#64748b',
    fontSize: 10.5,
    fontWeight: '900',
    letterSpacing: 1,
    marginRight: 4,
  },
  accentBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accentBtnActive: {
    borderWidth: 2,
    borderColor: '#ffffff',
    transform: [{ scale: 1.15 }],
  },
  accentCheck: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '900',
  },
  searchSection: {
    paddingHorizontal: 20,
    marginTop: 14,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.8,
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 48,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
  },
  clearIcon: {
    fontSize: 14,
    padding: 4,
  },
  filtersRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 12,
    marginBottom: 8,
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  filterPillText: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  filterPillTextActive: {
    color: '#ffffff',
    fontWeight: '800',
  },
  body: {
    flex: 1,
  },
  list: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 90,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 6,
  },
  muted: {
    fontSize: 14,
    textAlign: 'center',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 14,
  },
  fab: {
    position: 'absolute',
    bottom: 26,
    right: 22,
    width: 60,
    height: 60,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 14,
    elevation: 8,
    borderWidth: 1.5,
  },
  fabIcon: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: '400',
    marginTop: -2,
  },
});
