import { Platform } from 'react-native';

let Notifications = null;
try {
  // Dynamic require inside try-catch to prevent top-level module evaluation errors in Expo Go
  Notifications = require('expo-notifications');
  if (Notifications && Notifications.setNotificationHandler) {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });
  }
} catch (e) {
  // Expo Go safe fallback: prevents "app entry point named main was not registered" error
  Notifications = null;
}

export async function requestNotificationPermissions() {
  try {
    if (!Notifications || !Notifications.getPermissionsAsync) return false;

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (Platform.OS === 'android' && Notifications.setNotificationChannelAsync) {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Task Reminders',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#6366f1',
      });
    }

    return finalStatus === 'granted';
  } catch (error) {
    return false;
  }
}

export async function scheduleTaskNotification(taskTitle, dueDate) {
  try {
    if (!Notifications || !Notifications.scheduleNotificationAsync) return null;

    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) return null;

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: '⏰ Task Reminder Set!',
        body: `Reminder created for: "${taskTitle}" ${dueDate ? `(Due: ${dueDate})` : ''}`,
        sound: true,
        data: { taskTitle },
      },
      trigger: {
        seconds: 2,
      },
    });

    return notificationId;
  } catch (error) {
    return null;
  }
}
