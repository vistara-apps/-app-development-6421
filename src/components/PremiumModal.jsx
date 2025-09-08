import React, { useState } from 'react';
import { X, Crown, Sparkles, Zap, Target } from 'lucide-react';
import { usePaymentContext } from '../hooks/usePaymentContext';

const PremiumModal = ({ isOpen, onClose, onUpgrade }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { createSession } = usePaymentContext();

  const handleUpgrade = async () => {
    setIsLoading(true);
    try {
      await createSession();
      onUpgrade();
      onClose();
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">Go Premium</h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mt-1">
                <Sparkles className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <h3 className="text-white font-medium">Advanced Rituals</h3>
                <p className="text-white/70 text-sm">Access exclusive resilience-building rituals</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center mt-1">
                <Zap className="w-4 h-4 text-green-400" />
              </div>
              <div>
                <h3 className="text-white font-medium">Super Streaks</h3>
                <p className="text-white/70 text-sm">Unlock streak savers and multipliers</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center mt-1">
                <Target className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <h3 className="text-white font-medium">Detailed Analytics</h3>
                <p className="text-white/70 text-sm">Advanced progress tracking and insights</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-lg p-4 border border-yellow-400/30 mb-6">
            <div className="text-center">
              <p className="text-white/90 text-sm">One-time unlock</p>
              <p className="text-white text-2xl font-bold">$0.50</p>
              <p className="text-white/70 text-xs">Secure crypto payment</p>
            </div>
          </div>

          <button
            onClick={handleUpgrade}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-medium py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing...' : 'Upgrade Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PremiumModal;