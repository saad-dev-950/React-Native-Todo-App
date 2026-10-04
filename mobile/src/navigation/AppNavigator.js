import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TodoScreen from '../screens/TodoScreen';
import AddTodoScreen from '../screens/AddTodoScreen';
import EditTodoScreen from '../screens/EditTodoScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="TodoHome"
        component={TodoScreen}
        options={{ title: 'My Todos' }}
      />
      <Stack.Screen
        name="AddTodo"
        component={AddTodoScreen}
        options={{ title: 'Add Task' }}
      />
      <Stack.Screen
        name="EditTodo"
        component={EditTodoScreen}
        options={{ title: 'Edit Task' }}
      />
    </Stack.Navigator>
  );
}
