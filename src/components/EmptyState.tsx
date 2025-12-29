import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

export function EmptyState() {
  return (
    <View style={styles.container}>
      <Text variant="titleMedium" style={styles.title}>
        No plants yet
      </Text>
      <Text variant="bodyMedium" style={styles.subtitle}>
        Tap the + button to add a plant
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  title: {
    fontWeight: '600',
    color: '#5A6C6A',
    marginBottom: 8,
  },
  subtitle: {
    color: '#5A6C6A',
  },
});
