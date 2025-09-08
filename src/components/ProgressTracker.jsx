import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Trophy, Target, Zap, Award } from 'lucide-react';

const ProgressTracker = ({ userData, variant = 'streak' }) => {
  const weeklyData = [
    { day: 'Mon', completed: 3 },
    { day: 'Tue', completed: 2 },
    { day: 'Wed', completed: 4 },
    { day: 'Thu', completed: 1 },
    { day: 'Fri', completed: 3 },
    { day: 'Sat', completed: 2 },
    { day: 'Sun', completed: 4 },
  ];

  const monthlyProgress = [
    { week: 'W1', rituals: 12 },
    { week: 'W2', rituals: 18 },
    { week: 'W3', rituals: 15 },
    { week: 'W4', rituals: 22 },
  ];

  if (variant === 'badges') {
    return (
      <div className="glass rounded-xl p-6 border border-white/30">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Award className="w-6 h-6" />
          Your Badges
        </h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {userData.badges?.map((badge, index) => (
            <div key={index} className="bg-white/10 rounded-lg p-4 text-center backdrop-blur-sm border border-white/20">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-white font-medium text-sm">{badge.name}</h4>
              <p className="text-white/70 text-xs mt-1">{badge.description}</p>
            </div>
          ))}
          
          {(!userData.badges || userData.badges.length === 0) && (
            <div className="col-span-full text-center py-8">
              <Trophy className="w-12 h-12 text-white/40 mx-auto mb-2" />
              <p className="text-white/60">Complete rituals to earn badges!</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="glass rounded-xl p-6 border border-white/30">
      <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
        <Target className="w-6 h-6" />
        Progress Overview
      </h3>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm border border-white/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <p className="text-white/70 text-sm">Current Streak</p>
              <p className="text-white text-xl font-bold">{userData.streakCount || 0} days</p>
            </div>
          </div>
        </div>

        <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm border border-white/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <Trophy className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-white/70 text-sm">Total Points</p>
              <p className="text-white text-xl font-bold">{userData.totalPoints || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm border border-white/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-white/70 text-sm">Badges Earned</p>
              <p className="text-white text-xl font-bold">{userData.badges?.length || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/5 rounded-lg p-4 backdrop-blur-sm border border-white/10">
          <h4 className="text-white font-medium mb-4">This Week</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyData}>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }} />
              <Bar dataKey="completed" fill="rgba(59, 130, 246, 0.8)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white/5 rounded-lg p-4 backdrop-blur-sm border border-white/10">
          <h4 className="text-white font-medium mb-4">Monthly Trend</h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={monthlyProgress}>
              <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }} />
              <Line type="monotone" dataKey="rituals" stroke="#10B981" strokeWidth={3} dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;