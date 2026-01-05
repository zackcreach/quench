import { View, StyleSheet } from 'react-native';
import { Appbar, Icon, Text } from 'react-native-paper';
import { fonts } from '../theme/theme';

interface AppHeaderProps {
  onAddPress: () => void;
}

export function AppHeader({ onAddPress }: AppHeaderProps) {
  return (
    <Appbar.Header style={styles.header}>
      <View style={styles.titleContainer}>
        <Icon source="spa" size={24} color="#FFFFFF" />
        <Text style={styles.title}>Quench</Text>
      </View>
      <Appbar.Action icon="plus" iconColor="#FFFFFF" onPress={onAddPress} accessibilityLabel="Add plant" />
    </Appbar.Header>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#52796f',
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingLeft: 16,
  },
  title: {
    fontSize: 20,
    fontFamily: fonts.bold,
    letterSpacing: -0.4,
    color: '#FFFFFF',
  },
});
