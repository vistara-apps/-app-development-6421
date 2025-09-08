import React, { useState } from 'react';
import { X, Heart, Smile, Meh, Frown, Share2 } from 'lucide-react';

const RitualCompletionModal = ({ 
  isOpen, 
  onClose, 
  ritual, 
  onComplete,
  canShareToFarcaster = false 
}) => {
  const [moodBefore, setMoodBefore] = useState(null);
  const [moodAfter, setMoodAfter] = useState(null);
  const [notes, setNotes] = useState('');
  const [shareToFarcaster, setShareToFarcaster] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  const moodOptions = [
    { value: 1, icon: Frown, label: 'Struggling', color: 'text-red-400' },
    { value: 2, icon: Meh, label: 'Okay', color: 'text-yellow-400' },
    { value: 3, icon: Smile, label: 'Good', color: 'text-green-400' },
    { value: 4, icon: Heart, label: 'Great', color: 'text-pink-400' }
  ];

  const handleComplete = async () => {
    if (!moodBefore) {
      alert('Please select how you felt before the ritual');
      return;
    }

    setIsCompleting(true);
    try {
      await onComplete(ritual.id, moodBefore, moodAfter, notes, shareToFarcaster);
      onClose();
      // Reset form
      setMoodBefore(null);
      setMoodAfter(null);
      setNotes('');
      setShareToFarcaster(false);
    } catch (error) {
      console.error('Failed to complete ritual:', error);
      alert('Failed to complete ritual. Please try again.');
    } finally {
      setIsCompleting(false);
    }
  };

  const MoodSelector = ({ value, onChange, label }) => (
    <div>
      <p className="text-white text-sm font-medium mb-3">{label}</p>
      <div className="flex gap-3 justify-center">
        {moodOptions.map((mood) => {
          const Icon = mood.icon;
          const isSelected = value === mood.value;
          
          return (
            <button
              key={mood.value}
              onClick={() => onChange(mood.value)}
              className={`
                flex flex-col items-center gap-2 p-3 rounded-lg transition-all duration-200
                ${isSelected 
                  ? 'bg-white/20 border-2 border-white/40 scale-110' 
                  : 'bg-white/5 border border-white/20 hover:bg-white/10'
                }
              `}
            >
              <Icon className={`w-6 h-6 ${isSelected ? mood.color : 'text-white/60'}`} />
              <span className={`text-xs ${isSelected ? 'text-white' : 'text-white/60'}`}>
                {mood.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">Complete Ritual</h2>
              <p className="text-white/80 text-sm">{ritual?.name}</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Mood Before */}
            <MoodSelector
              value={moodBefore}
              onChange={setMoodBefore}
              label="How did you feel before this ritual?"
            />

            {/* Mood After (optional) */}
            <MoodSelector
              value={moodAfter}
              onChange={setMoodAfter}
              label="How do you feel now? (optional)"
            />

            {/* Notes */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Reflection Notes (optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40 h-24 resize-none"
                placeholder="How did this ritual make you feel? Any insights or thoughts..."
              />
            </div>

            {/* Farcaster Sharing */}
            {canShareToFarcaster && (
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="shareToFarcaster"
                    checked={shareToFarcaster}
                    onChange={(e) => setShareToFarcaster(e.target.checked)}
                    className="w-4 h-4 text-accent bg-white/10 border-white/20 rounded focus:ring-accent focus:ring-2"
                  />
                  <label htmlFor="shareToFarcaster" className="flex items-center gap-2 text-white text-sm">
                    <Share2 className="w-4 h-4" />
                    Share completion on Farcaster
                  </label>
                </div>
                <p className="text-white/60 text-xs mt-2 ml-7">
                  Let your community celebrate your progress!
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleComplete}
                disabled={isCompleting || !moodBefore}
                className="flex-1 px-4 py-3 bg-accent hover:bg-accent/80 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCompleting ? 'Completing...' : 'Complete Ritual'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RitualCompletionModal;
