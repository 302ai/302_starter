import * as React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { cn } from '@/lib/utils'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  className?: string
}

export const Modal = ({ isOpen, onClose, children, title, className }: ModalProps) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in"
          aria-hidden="true"
        />
        <Dialog.Content
          className={cn(
            "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background p-6 rounded-lg shadow-lg animate-in zoom-in-90",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            "w-full max-w-lg max-h-[85vh] overflow-y-auto",
            className
          )}
          aria-labelledby={title ? "modal-title" : undefined}
        >
          {title && (
            <Dialog.Title
              id="modal-title"
              className="text-lg font-semibold leading-none tracking-tight mb-4"
            >
              {title}
            </Dialog.Title>
          )}
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
