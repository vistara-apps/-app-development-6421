import { useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { dbHelpers } from '../lib/supabase';
import { socialUtils } from '../lib/farcaster';

// Badge definitions
const AVAILABLE_BADGES = [
  {
    id: 'early_bird',
    name: 'Early Bird',
    description: '7-day morning ritual streak',
    imageUrl: '/badges/early-bird.svg',
    condition: (userData) => userData.streakCount >= 7
  },
  {
    id: 'mindful_master',
    name: 'Mindful Master',
    description: 'Complete 50 mindfulness rituals',
    imageUrl: '/badges/mindful-master.svg',
    condition: (userData, sessions) => 
      sessions.filter(s => s.rituals?.category === 'mindfulness').length >= 50
  },
  {
    id: 'consistency_champion',
    name: 'Consistency Champion',
    description: '30-day streak achieved',
    imageUrl: '/badges/consistency-champion.svg',
    condition: (userData) => userData.streakCount >= 30
  },
  {
    id: 'resilience_warrior',
    name: 'Resilience Warrior',
    description: '100 rituals completed',
    imageUrl: '/badges/resilience-warrior.svg',
    condition: (userData, sessions) => sessions.length >= 100
  },
  {
    id: 'point_collector',
    name: 'Point Collector',
    description: '500 points earned',
    imageUrl: '/badges/point-collector.svg',
    condition: (userData) => userData.totalPoints >= 500
  }
];

export const useAppData = () => {
  const { address, isConnected } = useAccount();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Core app state
  const [userData, setUserData] = useState({
    userId: null,
    farcasterId: null,
    streakCount: 0,
    totalPoints: 0,
    badges: [],
    createdAt: null,
    isPremium: false
  });
  
  const [rituals, setRituals] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [availableBadges] = useState(AVAILABLE_BADGES);

  // Initialize user data
  const initializeUser = useCallback(async () => {
    if (!address || !isConnected) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Try to get existing user
      let user = await dbHelpers.getUser(address);
      
      // Create user if doesn't exist
      if (!user) {
        user = await dbHelpers.createUser({
          userId: address,
          farcasterId: null,
          streakCount: 0,
          totalPoints: 0,
          createdAt: new Date().toISOString(),
          activeRituals: [],
          badgesEarned: []
        });
      }

      setUserData({
        userId: user.userId,
        farcasterId: user.farcasterId,
        streakCount: user.streakCount || 0,
        totalPoints: user.totalPoints || 0,
        badges: user.badgesEarned || [],
        createdAt: user.createdAt,
        isPremium: user.isPremium || false
      });

      // Load user's rituals and sessions
      const [userRituals, userSessions] = await Promise.all([
        dbHelpers.getUserRituals(address),
        dbHelpers.getUserSessions(address)
      ]);

      setRituals(userRituals);
      setSessions(userSessions);

      // Check for new badges
      await checkAndAwardBadges(user, userSessions);

    } catch (err) {
      console.error('Failed to initialize user:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [address, isConnected]);

  // Check and award new badges
  const checkAndAwardBadges = useCallback(async (user, userSessions) => {
    const currentBadgeIds = user.badgesEarned || [];
    const newBadges = [];

    for (const badge of AVAILABLE_BADGES) {
      if (!currentBadgeIds.includes(badge.id) && badge.condition(user, userSessions)) {
        newBadges.push(badge);
        try {
          await dbHelpers.awardBadge(user.userId, badge.id);
        } catch (err) {
          console.error('Failed to award badge:', err);
        }
      }
    }

    if (newBadges.length > 0) {
      const updatedBadges = [...currentBadgeIds, ...newBadges.map(b => b.id)];
      setUserData(prev => ({
        ...prev,
        badges: updatedBadges
      }));

      // Share badge achievements on Farcaster if enabled
      if (user.farcasterId) {
        for (const badge of newBadges) {
          try {
            await socialUtils.shareBadgeAchievement(badge, user.farcasterId);
          } catch (err) {
            console.error('Failed to share badge:', err);
          }
        }
      }
    }
  }, []);

  // Create a new ritual
  const createRitual = useCallback(async (ritualData) => {
    if (!userData.userId) throw new Error('User not initialized');

    try {
      const newRitual = await dbHelpers.createRitual({
        ...ritualData,
        userId: userData.userId,
        ritualId: `ritual_${Date.now()}`,
        frequency: 'daily',
        completedToday: false,
        createdAt: new Date().toISOString()
      });

      setRituals(prev => [newRitual, ...prev]);
      return newRitual;
    } catch (err) {
      console.error('Failed to create ritual:', err);
      throw err;
    }
  }, [userData.userId]);

  // Complete a ritual
  const completeRitual = useCallback(async (ritualId, moodBefore = null, moodAfter = null, notes = '') => {
    if (!userData.userId) throw new Error('User not initialized');

    try {
      const ritual = rituals.find(r => r.ritualId === ritualId);
      if (!ritual) throw new Error('Ritual not found');

      // Create session record
      const session = await dbHelpers.createSession({
        sessionId: `session_${Date.now()}`,
        userId: userData.userId,
        ritualId: ritualId,
        timestamp: new Date().toISOString(),
        moodBefore,
        moodAfter,
        notes
      });

      // Update ritual completion status
      await dbHelpers.updateRitual(ritualId, {
        completedToday: true,
        lastCompleted: new Date().toISOString()
      });

      // Calculate points and update user data
      const pointsEarned = 10 + (ritual.streak || 0); // Base points + streak bonus
      const newStreakCount = userData.streakCount + 1;
      const newTotalPoints = userData.totalPoints + pointsEarned;

      await dbHelpers.updateUser(userData.userId, {
        streakCount: newStreakCount,
        totalPoints: newTotalPoints
      });

      // Update local state
      setUserData(prev => ({
        ...prev,
        streakCount: newStreakCount,
        totalPoints: newTotalPoints
      }));

      setRituals(prev => prev.map(r => 
        r.ritualId === ritualId 
          ? { ...r, completedToday: true, streak: (r.streak || 0) + 1 }
          : r
      ));

      setSessions(prev => [session, ...prev]);

      // Check for new badges
      const updatedUser = { ...userData, streakCount: newStreakCount, totalPoints: newTotalPoints };
      await checkAndAwardBadges(updatedUser, [session, ...sessions]);

      // Share on Farcaster if enabled
      if (userData.farcasterId) {
        try {
          await socialUtils.shareRitualCompletion(
            { ...ritual, points: pointsEarned },
            updatedUser,
            userData.farcasterId
          );
        } catch (err) {
          console.error('Failed to share ritual completion:', err);
        }
      }

      return { session, pointsEarned };
    } catch (err) {
      console.error('Failed to complete ritual:', err);
      throw err;
    }
  }, [userData, rituals, sessions, checkAndAwardBadges]);

  // Update user premium status
  const upgradeToPremium = useCallback(async () => {
    if (!userData.userId) throw new Error('User not initialized');

    try {
      await dbHelpers.updateUser(userData.userId, { isPremium: true });
      setUserData(prev => ({ ...prev, isPremium: true }));
    } catch (err) {
      console.error('Failed to upgrade to premium:', err);
      throw err;
    }
  }, [userData.userId]);

  // Connect Farcaster account
  const connectFarcaster = useCallback(async (farcasterId) => {
    if (!userData.userId) throw new Error('User not initialized');

    try {
      await dbHelpers.updateUser(userData.userId, { farcasterId });
      setUserData(prev => ({ ...prev, farcasterId }));
    } catch (err) {
      console.error('Failed to connect Farcaster:', err);
      throw err;
    }
  }, [userData.userId]);

  // Get user's earned badges with details
  const getEarnedBadges = useCallback(() => {
    return availableBadges.filter(badge => userData.badges.includes(badge.id));
  }, [userData.badges, availableBadges]);

  // Get progress towards next badges
  const getBadgeProgress = useCallback(() => {
    return availableBadges
      .filter(badge => !userData.badges.includes(badge.id))
      .map(badge => ({
        ...badge,
        progress: calculateBadgeProgress(badge, userData, sessions)
      }));
  }, [userData, sessions, availableBadges]);

  // Calculate progress towards a specific badge
  const calculateBadgeProgress = (badge, user, userSessions) => {
    switch (badge.id) {
      case 'early_bird':
        return Math.min(user.streakCount / 7, 1);
      case 'consistency_champion':
        return Math.min(user.streakCount / 30, 1);
      case 'mindful_master':
        const mindfulSessions = userSessions.filter(s => s.rituals?.category === 'mindfulness').length;
        return Math.min(mindfulSessions / 50, 1);
      case 'resilience_warrior':
        return Math.min(userSessions.length / 100, 1);
      case 'point_collector':
        return Math.min(user.totalPoints / 500, 1);
      default:
        return 0;
    }
  };

  // Initialize on mount and when wallet changes
  useEffect(() => {
    initializeUser();
  }, [initializeUser]);

  return {
    // State
    userData,
    rituals,
    sessions,
    availableBadges,
    loading,
    error,
    
    // Actions
    createRitual,
    completeRitual,
    upgradeToPremium,
    connectFarcaster,
    
    // Computed values
    earnedBadges: getEarnedBadges(),
    badgeProgress: getBadgeProgress(),
    
    // Utils
    isConnected: isConnected && userData.userId,
    canShareToFarcaster: !!userData.farcasterId
  };
};
