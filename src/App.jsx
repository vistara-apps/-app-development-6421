import React, { useState, useEffect } from 'react';
import { Plus, BarChart3, Award, Settings, Crown, Sparkles } from 'lucide-react';
import AppShell from './components/AppShell';
import RitualCard from './components/RitualCard';
import ProgressTracker from './components/ProgressTracker';
import PremiumModal from './components/PremiumModal';

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isPremium, setIsPremium] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [rituals, setRituals] = useState([
    {
      id: 1,
      name: "Morning Gratitude",
      description: "Write down 3 things you're grateful for",
      streak: 5,
      points: 25,
      completed: false,
      category: "mindfulness"
    },
    {
      id: 2,
      name: "Deep Breathing",
      description: "5 minutes of mindful breathing",
      streak: 3,
      points: 15,
      completed: false,
      category: "wellness"
    },
    {
      id: 3,
      name: "Positive Affirmation",
      description: "Repeat your personal power statement",
      streak: 7,
      points: 35,
      completed: true,
      category: "mindset"
    }
  ]);

  const [userData, setUserData] = useState({
    streakCount: 7,
    totalPoints: 150,
    badges: [
      { name: "Early Bird", description: "7-day morning ritual streak" },
      { name: "Mindful Master", description: "Complete 50 mindfulness rituals" }
    ]
  });

  const [showAddRitual, setShowAddRitual] = useState(false);
  const [newRitual, setNewRitual] = useState({ name: '', description: '', category: 'mindfulness' });

  const premiumRituals = [
    { name: "Advanced Meditation", description: "15-minute guided resilience meditation", category: "premium" },
    { name: "Emotional Mapping", description: "Deep dive into emotional patterns", category: "premium" },
    { name: "Stress Immunity", description: "Build resistance to daily stressors", category: "premium" }
  ];

  const handleCompleteRitual = (ritualId) => {
    setRituals(prev => prev.map(ritual => 
      ritual.id === ritualId 
        ? { ...ritual, completed: true, points: ritual.points + 5 }
        : ritual
    ));
    
    setUserData(prev => ({
      ...prev,
      totalPoints: prev.totalPoints + 5,
      streakCount: prev.streakCount + 1
    }));
  };

  const handleAddRitual = () => {
    if (newRitual.name && newRitual.description) {
      const ritual = {
        id: Date.now(),
        ...newRitual,
        streak: 0,
        points: 0,
        completed: false
      };
      setRituals(prev => [...prev, ritual]);
      setNewRitual({ name: '', description: '', category: 'mindfulness' });
      setShowAddRitual(false);
    }
  };

  const handlePremiumUpgrade = () => {
    setIsPremium(true);
    // Add premium rituals to available rituals
    const premiumRitualsWithIds = premiumRituals.map((ritual, index) => ({
      ...ritual,
      id: Date.now() + index,
      streak: 0,
      points: 0,
      completed: false
    }));
    setRituals(prev => [...prev, ...premiumRitualsWithIds]);
  };

  const NavTab = ({ id, icon: Icon, label, isActive, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-200 ${
        isActive 
          ? 'bg-white/20 text-white' 
          : 'text-white/70 hover:text-white hover:bg-white/10'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="text-xs font-medium">{label}</span>
    </button>
  );

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto">
        {/* Main Content */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Header Stats */}
            <div className="glass rounded-xl p-6 border border-white/30">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                    Good morning! 🌅
                  </h2>
                  <p className="text-white/80">Ready to build your resilience today?</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-white/70 text-sm">Current Streak</p>
                    <p className="text-white text-2xl font-bold">{userData.streakCount}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-white/70 text-sm">Total Points</p>
                    <p className="text-white text-2xl font-bold">{userData.totalPoints}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Today's Rituals */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-white">Today's Rituals</h3>
                <button
                  onClick={() => setShowAddRitual(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200 text-white text-sm font-medium backdrop-blur-sm border border-white/30"
                >
                  <Plus className="w-4 h-4" />
                  Add Ritual
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {rituals.map(ritual => (
                  <RitualCard
                    key={ritual.id}
                    ritual={ritual}
                    variant={ritual.completed ? 'completed' : 'active'}
                    onComplete={handleCompleteRitual}
                  />
                ))}
              </div>
            </div>

            {/* Premium Callout */}
            {!isPremium && (
              <div className="glass rounded-xl p-6 border border-yellow-400/30 bg-gradient-to-r from-yellow-400/10 to-orange-500/10">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                      <Crown className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">Unlock Premium Rituals</h3>
                      <p className="text-white/80 text-sm">Access advanced resilience-building techniques and exclusive content</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowPremiumModal(true)}
                    className="px-6 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-medium rounded-lg transition-all duration-200 whitespace-nowrap"
                  >
                    Upgrade $0.50
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="space-y-6">
            <ProgressTracker userData={userData} variant="streak" />
            <ProgressTracker userData={userData} variant="badges" />
          </div>
        )}

        {/* Add Ritual Modal */}
        {showAddRitual && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 max-w-md w-full">
              <div className="p-6">
                <h2 className="text-xl font-bold text-white mb-4">Add New Ritual</h2>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Ritual Name</label>
                    <input
                      type="text"
                      value={newRitual.name}
                      onChange={(e) => setNewRitual(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40"
                      placeholder="e.g., Evening Reflection"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Description</label>
                    <textarea
                      value={newRitual.description}
                      onChange={(e) => setNewRitual(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40 h-24 resize-none"
                      placeholder="Describe your ritual..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Category</label>
                    <select
                      value={newRitual.category}
                      onChange={(e) => setNewRitual(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40"
                    >
                      <option value="mindfulness">Mindfulness</option>
                      <option value="wellness">Wellness</option>
                      <option value="mindset">Mindset</option>
                      <option value="gratitude">Gratitude</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowAddRitual(false)}
                    className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddRitual}
                    className="flex-1 px-4 py-3 bg-accent hover:bg-accent/80 text-white rounded-lg transition-colors font-medium"
                  >
                    Add Ritual
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Premium Modal */}
        <PremiumModal
          isOpen={showPremiumModal}
          onClose={() => setShowPremiumModal(false)}
          onUpgrade={handlePremiumUpgrade}
        />

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/20 to-transparent backdrop-blur-sm">
          <div className="max-w-md mx-auto bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-2">
            <div className="flex justify-around">
              <NavTab
                id="dashboard"
                icon={Sparkles}
                label="Rituals"
                isActive={activeTab === 'dashboard'}
                onClick={setActiveTab}
              />
              <NavTab
                id="progress"
                icon={BarChart3}
                label="Progress"
                isActive={activeTab === 'progress'}
                onClick={setActiveTab}
              />
              <NavTab
                id="badges"
                icon={Award}
                label="Badges"
                isActive={activeTab === 'badges'}
                onClick={setActiveTab}
              />
              <NavTab
                id="settings"
                icon={Settings}
                label="Settings"
                isActive={activeTab === 'settings'}
                onClick={setActiveTab}
              />
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default App;