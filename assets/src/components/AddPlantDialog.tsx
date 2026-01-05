import { useState, useEffect } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Portal, Modal, TextInput, Button, Text } from 'react-native-paper';
import type { Plant } from '../types/plant';
import { buttonStyles, fonts } from '../theme/theme';

interface AddPlantDialogProps {
  visible: boolean;
  editingPlant: Plant | null;
  onDismiss: () => void;
  onSave: (plantData: { name: string; intervalDays: number }) => void;
}

export function AddPlantDialog({
  visible,
  editingPlant,
  onDismiss,
  onSave,
}: AddPlantDialogProps) {
  const [name, setName] = useState('');
  const [intervalDays, setIntervalDays] = useState('7');
  const [nameError, setNameError] = useState('');
  const [intervalError, setIntervalError] = useState('');

  useEffect(() => {
    if (editingPlant) {
      setName(editingPlant.name);
      setIntervalDays(editingPlant.intervalDays.toString());
    } else {
      setName('');
      setIntervalDays('7');
    }
    setNameError('');
    setIntervalError('');
  }, [editingPlant, visible]);

  const handleSave = () => {
    let hasError = false;

    if (!name.trim()) {
      setNameError('Plant name is required');
      hasError = true;
    } else {
      setNameError('');
    }

    const interval = parseInt(intervalDays, 10);
    if (!intervalDays || isNaN(interval) || interval < 1) {
      setIntervalError('Interval must be at least 1 day');
      hasError = true;
    } else if (interval > 365) {
      setIntervalError('Interval cannot exceed 365 days');
      hasError = true;
    } else {
      setIntervalError('');
    }

    if (hasError) return;

    onSave({
      name: name.trim(),
      intervalDays: interval,
    });
  };

  const handleNameChange = (value: string) => {
    setName(value);
    if (nameError) setNameError('');
  };

  const handleIntervalChange = (value: string) => {
    setIntervalDays(value);
    if (intervalError) setIntervalError('');
  };

  const dialogTitle = editingPlant ? 'Edit Plant' : 'Add New Plant';
  const saveButtonLabel = editingPlant ? 'Save Changes' : 'Add Plant';

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.container}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <Text variant="titleLarge" style={styles.title}>
            {dialogTitle}
          </Text>

          <TextInput
            label="Plant Name"
            placeholder="e.g., Snake Plant, Garden Bed 1"
            value={name}
            onChangeText={handleNameChange}
            error={!!nameError}
            style={styles.input}
            mode="outlined"
            autoFocus
          />
          {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}

          <TextInput
            label="Watering Interval (days)"
            value={intervalDays}
            onChangeText={handleIntervalChange}
            error={!!intervalError}
            style={styles.input}
            mode="outlined"
            keyboardType="numeric"
            right={<TextInput.Affix text="days" />}
          />
          {intervalError ? (
            <Text style={styles.errorText}>{intervalError}</Text>
          ) : (
            <Text style={styles.helperText}>How often should this plant be watered?</Text>
          )}

          <View style={styles.actions}>
            <Button mode="outlined" onPress={onDismiss} style={styles.button} labelStyle={styles.buttonLabel}>
              Cancel
            </Button>
            <Button mode="contained" onPress={handleSave} style={styles.button} labelStyle={styles.buttonLabel}>
              {saveButtonLabel}
            </Button>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    margin: 16,
    padding: 24,
    borderRadius: 16,
  },
  title: {
    fontWeight: '600',
    marginBottom: 24,
  },
  input: {
    marginBottom: 8,
  },
  errorText: {
    color: '#d14d3a',
    fontSize: 12,
    marginBottom: 16,
    marginLeft: 4,
  },
  helperText: {
    color: '#5A6C6A',
    fontSize: 12,
    marginBottom: 16,
    marginLeft: 4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 8,
  },
  button: {
    minWidth: 100,
    borderRadius: buttonStyles.borderRadius,
  },
  buttonLabel: {
    fontFamily: fonts.semiBold,
    letterSpacing: 0.14,
  },
});
