import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TodoScreen from '../screens/TodoScreen';
import AddTodoScreen from '../screens/AddTodoScreen';
import EditTodoScreen from '../screens/EditTodoScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#090d16' },
        headerTintColor: '#ffffff',
        headerTitleStyle: { fontWeight: '800' },
      }}
    >
      <Stack.Screen
        name="TodoHome"
        component={TodoScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddTodo"
        component={AddTodoScreen}
        options={{ title: 'Add Task 🚀', headerStyle: { backgroundColor: '#090d16' }, headerTintColor: '#fff' }}
      />
      <Stack.Screen
        name="EditTodo"
        component={EditTodoScreen}
        options={{ title: 'Edit Task ✏️', headerStyle: { backgroundColor: '#090d16' }, headerTintColor: '#fff' }}
      />
    </Stack.Navigator>
  );
}
