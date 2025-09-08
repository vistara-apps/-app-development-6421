import React from 'react';
import { Check, Clock, Flame, Star } from 'lucide-react';

const RitualCard = ({ ritual, onComplete, variant = 'active' }) => {
  const isCompleted = variant === 'completed';
  
  return (
    <div className={`
      p-4 sm:p-6 rounded-lg sm:rounded-xl transition-all duration-300 cursor-pointer transform hover:scale-105
      ${isCompleted 
        ? 'bg-green-500/20 border border-green-400/30 backdrop-blur-sm' 
        : 'glass border border-white/30 hover:bg-white/20'
      }
    `}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-1">{ritual.name}</h3>
          <p className="text-white/80 text-sm sm:text-base">{ritual.description}</p>
        </div>
        <div className={`
          w-8 h-8 rounded-full flex items-center justify-center ml-3
          ${isCompleted ? 'bg-green-500' : 'bg-white/20'}
        `}>
          {isCompleted ? (
            <Check className="w-5 h-5 text-white" />
          ) : (
            <Clock className="w-5 h-5 text-white" />
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-white/80 text-sm">
          <div className="flex items-center gap-1">
            <Flame className="w-4 h-4" />
            <span>{ritual.streak || 0} days</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4" />
            <span>{ritual.points || 0} pts</span>
          </div>
        </div>

        {!isCompleted && (
          <button
            onClick={() => onComplete(ritual.id)}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200 text-white text-sm font-medium backdrop-blur-sm border border-white/30"
          >
            Complete
          </button>
        )}
      </div>
    </div>
  );
};

export default RitualCard;