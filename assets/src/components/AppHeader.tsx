import { View, StyleSheet } from 'react-native';
import { Appbar, Icon, Menu, Text } from 'react-native-paper';
import { useState } from 'react';
import { fonts } from '../theme/theme';
import type { Garden } from '../services/api';

interface AppHeaderProps {
  gardens: Garden[];
  selectedGardenId: string;
  onAddPress: () => void;
  onGardenSelected: (gardenId: string) => void;
  onLogoutPress: () => void;
}

export function AppHeader({ gardens, selectedGardenId, onAddPress, onGardenSelected, onLogoutPress }: AppHeaderProps) {
  const [menuVisible, setMenuVisible] = useState(false);

  const selectedGarden = gardens.find((garden) => garden.id === selectedGardenId);

  return (
    <Appbar.Header style={styles.header}>
      <View style={styles.titleContainer}>
        <Icon source="spa" size={24} color="#FFFFFF" />
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={<Text style={styles.title} onPress={() => setMenuVisible(true)}>{selectedGarden?.name ?? 'Quench'}</Text>}
        >
          {gardens.map((garden) => (
            <Menu.Item
              key={garden.id}
              title={garden.name}
              onPress={() => {
                onGardenSelected(garden.id);
                setMenuVisible(false);
              }}
            />
          ))}
        </Menu>
      </View>
      <Appbar.Action icon="plus" iconColor="#FFFFFF" onPress={onAddPress} accessibilityLabel="Add plant" />
      <Appbar.Action icon="logout" iconColor="#FFFFFF" onPress={onLogoutPress} accessibilityLabel="Log out" />
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
