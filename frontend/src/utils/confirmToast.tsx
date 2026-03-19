import toast from "react-hot-toast";

interface ConfirmToastOptions {
  title: string;
  description?: string;
  confirmLabel?: string;
  onConfirm: () => void | Promise<void>;
}

/**
 * Shows a react-hot-toast confirmation dialog with Cancel / confirm buttons.
 * Replaces both native browser confirm() and the repeated inline toast JSX.
 */
export function confirmToast({
  title,
  description = "This cannot be undone.",
  confirmLabel = "Delete",
  onConfirm,
}: ConfirmToastOptions) {
  toast(
    (t) => (
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">{title}</p>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 text-xs rounded-md border hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              await onConfirm();
            }}
            className="px-3 py-1 text-xs rounded-md bg-destructive text-white hover:bg-destructive/90 transition-colors"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    ),
    { duration: Infinity },
  );
}
