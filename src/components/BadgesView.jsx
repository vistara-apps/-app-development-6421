import React from 'react';
import { Award, Trophy, Target, Lock, Star, Zap } from 'lucide-react';

const BadgesView = ({ earnedBadges, badgeProgress, userData }) => {
  const BadgeCard = ({ badge, isEarned, progress = 0 }) => {
    const progressPercentage = Math.round(progress * 100);
    
    return (
      <div className={`
        relative p-6 rounded-xl border transition-all duration-300 hover:scale-105
        ${isEarned 
          ? 'glass border-yellow-400/30 bg-gradient-to-br from-yellow-400/10 to-orange-500/10' 
          : 'glass border-white/20 bg-white/5'
        }
      `}>
        {/* Badge Icon */}
        <div className="flex flex-col items-center text-center">
          <div className={`
            w-16 h-16 rounded-full flex items-center justify-center mb-4 relative
            ${isEarned 
              ? 'bg-gradient-to-br from-yellow-400 to-orange-500' 
              : 'bg-white/10 border-2 border-dashed border-white/30'
            }
          `}>
            {isEarned ? (
              <Trophy className="w-8 h-8 text-white" />
            ) : (
              <Lock className="w-6 h-6 text-white/50" />
            )}
            
            {/* Sparkle effect for earned badges */}
            {isEarned && (
              <>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-300 rounded-full animate-pulse">
                  <Star className="w-3 h-3 text-yellow-600 m-0.5" />
                </div>
                <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-orange-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}>
                  <Zap className="w-2 h-2 text-orange-700 m-0.5" />
                </div>
              </>
            )}
          </div>

          {/* Badge Info */}
          <h3 className={`text-lg font-semibold mb-2 ${isEarned ? 'text-white' : 'text-white/70'}`}>
            {badge.name}
          </h3>
          <p className={`text-sm mb-4 ${isEarned ? 'text-white/90' : 'text-white/60'}`}>
            {badge.description}
          </p>

          {/* Progress Bar for unearned badges */}
          {!isEarned && progress > 0 && (
            <div className="w-full">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white/70 text-xs">Progress</span>
                <span className="text-white text-xs font-medium">{progressPercentage}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-accent to-green-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          )}

          {/* Earned date for completed badges */}
          {isEarned && (
            <div className="mt-2 text-xs text-yellow-300 font-medium">
              ✨ Earned!
            </div>
          )}
        </div>
      </div>
    );
  };

  const StatCard = ({ icon: Icon, label, value, color = 'blue' }) => {
    const colorClasses = {
      blue: 'bg-blue-500/20 text-blue-400',
      green: 'bg-green-500/20 text-green-400',
      yellow: 'bg-yellow-500/20 text-yellow-400',
      purple: 'bg-purple-500/20 text-purple-400'
    };

    return (
      <div className="glass rounded-lg p-4 border border-white/20">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-white/70 text-sm">{label}</p>
            <p className="text-white text-xl font-bold">{value}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass rounded-xl p-6 border border-white/30">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
            <Award className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Badges & Achievements</h2>
            <p className="text-white/80">Celebrate your resilience milestones</p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Trophy}
            label="Badges Earned"
            value={earnedBadges.length}
            color="yellow"
          />
          <StatCard
            icon={Target}
            label="In Progress"
            value={badgeProgress.filter(b => b.progress > 0).length}
            color="blue"
          />
          <StatCard
            icon={Zap}
            label="Current Streak"
            value={`${userData.streakCount} days`}
            color="green"
          />
          <StatCard
            icon={Star}
            label="Total Points"
            value={userData.totalPoints}
            color="purple"
          />
        </div>
      </div>

      {/* Earned Badges */}
      {earnedBadges.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-400" />
            Earned Badges ({earnedBadges.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {earnedBadges.map((badge) => (
              <BadgeCard
                key={badge.id}
                badge={badge}
                isEarned={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* Badges in Progress */}
      {badgeProgress.filter(b => b.progress > 0).length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Target className="w-6 h-6 text-blue-400" />
            In Progress
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {badgeProgress
              .filter(badge => badge.progress > 0)
              .map((badge) => (
                <BadgeCard
                  key={badge.id}
                  badge={badge}
                  isEarned={false}
                  progress={badge.progress}
                />
              ))}
          </div>
        </div>
      )}

      {/* Locked Badges */}
      {badgeProgress.filter(b => b.progress === 0).length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Lock className="w-6 h-6 text-white/50" />
            Locked Badges
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {badgeProgress
              .filter(badge => badge.progress === 0)
              .map((badge) => (
                <BadgeCard
                  key={badge.id}
                  badge={badge}
                  isEarned={false}
                  progress={0}
                />
              ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {earnedBadges.length === 0 && badgeProgress.length === 0 && (
        <div className="glass rounded-xl p-12 border border-white/30 text-center">
          <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award className="w-10 h-10 text-white/40" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No Badges Yet</h3>
          <p className="text-white/70 mb-6">
            Complete your first ritual to start earning badges and building your resilience!
          </p>
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent/80 rounded-lg text-white font-medium transition-colors">
            <Zap className="w-5 h-5" />
            Start Your First Ritual
          </div>
        </div>
      )}

      {/* Motivational Footer */}
      <div className="glass rounded-lg p-6 border border-white/20 text-center">
        <h4 className="text-lg font-semibold text-white mb-2">Keep Building Your Resilience! 💪</h4>
        <p className="text-white/70 text-sm">
          Every ritual completed brings you closer to unbreakable emotional strength. 
          Consistency is the key to lasting transformation.
        </p>
      </div>
    </div>
  );
};

export default BadgesView;
