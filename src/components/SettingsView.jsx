import React, { useState } from 'react';
import { 
  Settings, 
  Bell, 
  Share2, 
  Crown, 
  User, 
  Moon, 
  Sun, 
  Volume2, 
  VolumeX,
  Smartphone,
  Link,
  LogOut
} from 'lucide-react';
import { useDisconnect } from 'wagmi';

const SettingsView = ({ 
  userData, 
  onConnectFarcaster, 
  onUpgradeToPremium,
  canShareToFarcaster 
}) => {
  const { disconnect } = useDisconnect();
  const [notifications, setNotifications] = useState(true);
  const [sounds, setSounds] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [showFarcasterInput, setShowFarcasterInput] = useState(false);
  const [farcasterFid, setFarcasterFid] = useState('');

  const handleConnectFarcaster = async () => {
    if (farcasterFid.trim()) {
      try {
        await onConnectFarcaster(farcasterFid.trim());
        setShowFarcasterInput(false);
        setFarcasterFid('');
      } catch (error) {
        alert('Failed to connect Farcaster account');
      }
    }
  };

  const SettingItem = ({ icon: Icon, title, description, children, action }) => (
    <div className="glass rounded-lg p-4 border border-white/20">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-medium">{title}</h3>
            <p className="text-white/70 text-sm mt-1">{description}</p>
            {children}
          </div>
        </div>
        {action && (
          <div className="ml-4">
            {action}
          </div>
        )}
      </div>
    </div>
  );

  const Toggle = ({ enabled, onChange }) => (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? 'bg-accent' : 'bg-white/20'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass rounded-xl p-6 border border-white/30">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Settings</h2>
            <p className="text-white/80">Customize your resilience journey</p>
          </div>
        </div>

        {/* User Info */}
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-medium">
                {userData.userId ? `${userData.userId.slice(0, 6)}...${userData.userId.slice(-4)}` : 'Not connected'}
              </p>
              <p className="text-white/70 text-sm">
                {userData.isPremium ? '👑 Premium Member' : 'Free Account'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Account Settings */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Account</h3>
        
        {!userData.isPremium && (
          <SettingItem
            icon={Crown}
            title="Upgrade to Premium"
            description="Unlock advanced rituals, streak savers, and detailed analytics"
            action={
              <button
                onClick={onUpgradeToPremium}
                className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-medium rounded-lg transition-all duration-200"
              >
                $0.50
              </button>
            }
          />
        )}

        <SettingItem
          icon={Share2}
          title="Farcaster Integration"
          description={
            canShareToFarcaster 
              ? "Connected! Share your progress with the community" 
              : "Connect your Farcaster account to share achievements"
          }
          action={
            !canShareToFarcaster ? (
              <button
                onClick={() => setShowFarcasterInput(true)}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
              >
                Connect
              </button>
            ) : (
              <div className="flex items-center gap-2 text-green-400">
                <Link className="w-4 h-4" />
                <span className="text-sm">Connected</span>
              </div>
            )
          }
        >
          {showFarcasterInput && (
            <div className="mt-3 space-y-3">
              <input
                type="text"
                value={farcasterFid}
                onChange={(e) => setFarcasterFid(e.target.value)}
                placeholder="Enter your Farcaster FID"
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleConnectFarcaster}
                  className="px-4 py-2 bg-accent hover:bg-accent/80 text-white rounded-lg transition-colors text-sm"
                >
                  Connect
                </button>
                <button
                  onClick={() => {
                    setShowFarcasterInput(false);
                    setFarcasterFid('');
                  }}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </SettingItem>
      </div>

      {/* Preferences */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Preferences</h3>
        
        <SettingItem
          icon={Bell}
          title="Notifications"
          description="Get reminded about your daily rituals"
          action={<Toggle enabled={notifications} onChange={setNotifications} />}
        />

        <SettingItem
          icon={sounds ? Volume2 : VolumeX}
          title="Sound Effects"
          description="Play sounds for completions and achievements"
          action={<Toggle enabled={sounds} onChange={setSounds} />}
        />

        <SettingItem
          icon={darkMode ? Moon : Sun}
          title="Dark Mode"
          description="Switch between light and dark themes"
          action={<Toggle enabled={darkMode} onChange={setDarkMode} />}
        />
      </div>

      {/* App Info */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">About</h3>
        
        <SettingItem
          icon={Smartphone}
          title="App Version"
          description="Resilience Rituals v1.0.0"
        />

        <SettingItem
          icon={LogOut}
          title="Disconnect Wallet"
          description="Sign out of your current wallet connection"
          action={
            <button
              onClick={() => disconnect()}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-lg transition-colors"
            >
              Disconnect
            </button>
          }
        />
      </div>

      {/* Footer */}
      <div className="glass rounded-lg p-4 border border-white/20 text-center">
        <p className="text-white/70 text-sm">
          Built with ❤️ for the Base ecosystem
        </p>
        <p className="text-white/50 text-xs mt-1">
          Building unbreakable emotional resilience, one ritual at a time
        </p>
      </div>
    </div>
  );
};

export default SettingsView;
