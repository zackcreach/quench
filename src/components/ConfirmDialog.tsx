import { View, StyleSheet } from 'react-native';
import { Portal, Modal, Text, Button } from 'react-native-paper';
import { buttonStyles, fonts } from '../theme/theme';

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

export function ConfirmDialog({
  visible,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Delete',
  cancelText = 'Cancel',
}: ConfirmDialogProps) {
  return (
    <Portal>
      <Modal visible={visible} onDismiss={onCancel} contentContainerStyle={styles.container}>
        <Text variant="titleLarge" style={styles.title}>
          {title}
        </Text>
        <Text variant="bodyMedium" style={styles.message}>
          {message}
        </Text>
        <View style={styles.actions}>
          <Button mode="outlined" onPress={onCancel} style={styles.button} labelStyle={styles.buttonLabel}>
            {cancelText}
          </Button>
          <Button mode="contained" onPress={onConfirm} style={styles.button} labelStyle={styles.buttonLabel} buttonColor="#A83D2E">
            {confirmText}
          </Button>
        </View>
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
    marginBottom: 8,
  },
  message: {
    color: '#5A6C6A',
    marginBottom: 24,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
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
