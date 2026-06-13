import React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { X } from "lucide-react"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-dark/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="relative w-full max-w-lg bg-background border border-border p-6 shadow-2xl z-10 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
              {title && (
                <h3 className="font-display text-lg font-semibold text-text-primary tracking-wide">
                  {title}
                </h3>
              )}
              <button
                onClick={onClose}
                className="text-text-secondary hover:text-dark transition-colors duration-200"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content Body */}
            <div className="overflow-y-auto max-h-[70vh]">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
