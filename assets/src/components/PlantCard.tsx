import { View, StyleSheet } from 'react-native';
import { Card, Text, Button, IconButton, Icon } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import type { Plant } from '../types/plant';
import { getPlantStatus } from '../utils/plantStatus';
import { statusColors, buttonStyles, fonts } from '../theme/theme';

interface PlantCardProps {
  plant: Plant;
  onWater: (plantId: string) => void;
  onEdit: (plant: Plant) => void;
  onDelete: (plant: Plant) => void;
  drag?: () => void;
  isActive?: boolean;
}

export function PlantCard({
  plant,
  onWater,
  onEdit,
  onDelete,
  drag,
  isActive,
}: PlantCardProps) {
  const status = getPlantStatus(plant);
  const colors = statusColors[status.type];
  const intervalLabel = plant.intervalDays === 1 ? 'day' : 'days';

  return (
    <Card style={[styles.card, isActive && styles.cardDragging]}>
      <Card.Content style={styles.content}>
        <View style={styles.header}>
          <IconButton
            icon="drag"
            size={20}
            onPressIn={drag}
            style={styles.dragHandle}
            accessibilityLabel="Drag to reorder"
          />
          <View style={styles.plantInfo}>
            <Text style={styles.plantName}>
              {plant.name}
            </Text>
            <Text style={styles.interval}>
              Every {plant.intervalDays} {intervalLabel}
            </Text>
          </View>
          <View style={styles.actions}>
            <IconButton
              icon="pencil"
              size={20}
              onPress={() => onEdit(plant)}
              accessibilityLabel={`Edit ${plant.name}`}
              style={styles.actionButton}
            />
            <IconButton
              icon="delete"
              size={20}
              onPress={() => onDelete(plant)}
              accessibilityLabel={`Delete ${plant.name}`}
              style={styles.actionButton}
            />
          </View>
        </View>

        <LinearGradient
          colors={[colors.gradientStart, colors.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.statusBox, { borderColor: colors.border }]}
        >
          <View>
            <Text style={styles.statusLabel}>
              {status.type === 'overdue' ? 'Overdue by' : 'Time until watering'}
            </Text>
            <Text style={[styles.countdown, { color: colors.text }]}>
              {status.countdownLabel}
            </Text>
          </View>
          <View style={styles.statusIndicator}>
            <Icon source={colors.icon} size={20} color={colors.text} />
            <Text style={[styles.statusText, { color: colors.text }]}>
              {status.statusLabel}
            </Text>
          </View>
        </LinearGradient>
      </Card.Content>

      <Card.Actions style={styles.cardActions}>
        <Button
          mode="outlined"
          icon="water"
          onPress={() => onWater(plant.id)}
          style={styles.waterButton}
          contentStyle={styles.waterButtonContent}
          labelStyle={styles.buttonLabel}
          accessibilityLabel={`Mark ${plant.name} as watered`}
        >
          Water Now
        </Button>
      </Card.Actions>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DEE9E5',
    elevation: 2,
    shadowColor: '#DEE9E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  cardDragging: {
    opacity: 0.8,
    elevation: 8,
  },
  content: {
    paddingBottom: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  dragHandle: {
    marginLeft: -8,
    opacity: 0.5,
  },
  plantInfo: {
    flex: 1,
  },
  plantName: {
    fontSize: 18,
    fontFamily: fonts.semiBold,
    color: '#1a2927',
    letterSpacing: -0.18,
  },
  interval: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: '#5A6C6A',
    marginTop: 2,
    letterSpacing: -0.13,
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    minWidth: 44,
    minHeight: 44,
  },
  statusBox: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: '#5A6C6A',
    marginBottom: 4,
    letterSpacing: -0.12,
  },
  countdown: {
    fontSize: 20,
    fontFamily: fonts.bold,
    letterSpacing: -0.2,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    letterSpacing: -0.14,
  },
  cardActions: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  waterButton: {
    flex: 1,
    borderRadius: buttonStyles.borderRadius,
    borderColor: '#BCD3CB',
    borderWidth: 1.5,
    marginLeft: 0,
  },
  waterButtonContent: {
    paddingVertical: 4,
  },
  buttonLabel: {
    fontFamily: fonts.semiBold,
    letterSpacing: 0.14,
  },
});
