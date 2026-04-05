import { useState } from 'react';

type OperationKey = 'words' | 'expressions' | 'lectures';

interface DangerousOperationState {
  pendingOperation: OperationKey | null;
  showFirstConfirm: boolean;
  showSecondConfirm: boolean;
  operationLoading: boolean;
  operationLabel: string;
  trigger: (operation: OperationKey) => void;
  handleFirstConfirm: () => void;
  handleSecondConfirm: () => Promise<void>;
  handleCancel: () => void;
}

const LABELS: Record<OperationKey, string> = {
  words: 'palabras',
  expressions: 'expresiones',
  lectures: 'lecturas',
};

export function useDangerousOperation(
  handlers: Record<OperationKey, () => Promise<void>>
): DangerousOperationState {
  const [pendingOperation, setPendingOperation] = useState<OperationKey | null>(null);
  const [showFirstConfirm, setShowFirstConfirm] = useState(false);
  const [showSecondConfirm, setShowSecondConfirm] = useState(false);
  const [operationLoading, setOperationLoading] = useState(false);

  const trigger = (operation: OperationKey) => {
    setPendingOperation(operation);
    setShowFirstConfirm(true);
  };

  const handleFirstConfirm = () => {
    setShowFirstConfirm(false);
    setShowSecondConfirm(true);
  };

  const handleSecondConfirm = async () => {
    if (!pendingOperation) return;
    setOperationLoading(true);
    try {
      await handlers[pendingOperation]();
      setShowSecondConfirm(false);
      setPendingOperation(null);
    } finally {
      setOperationLoading(false);
    }
  };

  const handleCancel = () => {
    setShowFirstConfirm(false);
    setShowSecondConfirm(false);
    setPendingOperation(null);
  };

  return {
    pendingOperation,
    showFirstConfirm,
    showSecondConfirm,
    operationLoading,
    operationLabel: pendingOperation ? LABELS[pendingOperation] : '',
    trigger,
    handleFirstConfirm,
    handleSecondConfirm,
    handleCancel,
  };
}
