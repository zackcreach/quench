import { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { AppHeader } from '../components/AppHeader';
import { PlantList } from '../components/PlantList';
import { AddPlantDialog } from '../components/AddPlantDialog';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { usePlants } from '../hooks/usePlants';
import { useNotifications } from '../hooks/useNotifications';
import type { Plant } from '../types/plant';
import { authApi } from '../services/api';

interface HomeScreenProps {
  gardenId: string;
  onLoggedOut: () => void;
}

export function HomeScreen({ gardenId, onLoggedOut }: HomeScreenProps) {
  const { plants, addPlant, updatePlant, deletePlant, waterPlant, reorderPlants } = usePlants(gardenId);
  useNotifications();

  const [dialogVisible, setDialogVisible] = useState(false);
  const [editingPlant, setEditingPlant] = useState<Plant | null>(null);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [plantToDelete, setPlantToDelete] = useState<Plant | null>(null);

  const handleOpenAddDialog = useCallback(() => {
    setEditingPlant(null);
    setDialogVisible(true);
  }, []);

  const handleLogout = useCallback(async () => {
    await authApi.logout();
    onLoggedOut();
  }, [onLoggedOut]);

  const handleOpenEditDialog = useCallback((plant: Plant) => {
    setEditingPlant(plant);
    setDialogVisible(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setDialogVisible(false);
  }, []);

  const handleSavePlant = useCallback(
    (plantData: { name: string; intervalDays: number }) => {
      if (editingPlant) {
        updatePlant(editingPlant.id, plantData);
      } else {
        addPlant(plantData);
      }
      handleCloseDialog();
    },
    [editingPlant, updatePlant, addPlant, handleCloseDialog]
  );

  const handleOpenConfirmDialog = useCallback((plant: Plant) => {
    setPlantToDelete(plant);
    setConfirmVisible(true);
  }, []);

  const handleCloseConfirmDialog = useCallback(() => {
    setConfirmVisible(false);
    setPlantToDelete(null);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (plantToDelete) {
      deletePlant(plantToDelete.id);
    }
    handleCloseConfirmDialog();
  }, [plantToDelete, deletePlant, handleCloseConfirmDialog]);

  return (
    <View style={styles.container}>
      <AppHeader onAddPress={handleOpenAddDialog} onLogoutPress={handleLogout} />

      <PlantList
        plants={plants}
        onWater={waterPlant}
        onEdit={handleOpenEditDialog}
        onDelete={handleOpenConfirmDialog}
        onReorder={reorderPlants}
      />

      <AddPlantDialog
        visible={dialogVisible}
        editingPlant={editingPlant}
        onDismiss={handleCloseDialog}
        onSave={handleSavePlant}
      />

      <ConfirmDialog
        visible={confirmVisible}
        title={`Delete ${plantToDelete?.name ?? 'plant'}?`}
        message={`Are you sure you want to delete ${plantToDelete?.name ?? 'this plant'}? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCloseConfirmDialog}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFBFB',
  },
});
