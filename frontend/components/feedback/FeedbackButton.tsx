'use client'

import { useState } from 'react';
import { Button } from '../ui/button';
import { MessageSquare, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FeedbackForm } from './FeedbackForm';

export function FeedbackButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-card border rounded-lg shadow-xl w-80 overflow-hidden"
          >
            <div className="p-4 border-b flex justify-between items-center bg-gradient-to-r from-purple-600 to-blue-600">
              <h3 className="font-medium text-white">Send us your feedback</h3>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-white hover:bg-white/10"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <FeedbackForm onSuccess={() => setIsOpen(false)} />
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="origin-bottom-right"
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="rounded-full h-14 w-14 p-0 shadow-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            >
              <MessageSquare className="h-6 w-6" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
