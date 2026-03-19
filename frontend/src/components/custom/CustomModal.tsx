import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CustomModalProps {
  open?: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const CustomModal = ({ open = false, onClose, title, children }: CustomModalProps) => {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent>
        {title && (
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
        )}
        <div className="rounded-lg bg-background p-3">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomModal;
