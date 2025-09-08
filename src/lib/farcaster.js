import axios from 'axios';

const NEYNAR_API_KEY = import.meta.env.VITE_NEYNAR_API_KEY || 'your-neynar-api-key';
const NEYNAR_BASE_URL = 'https://api.neynar.com/v1';

// Farcaster integration service
export const farcasterService = {
  // Cast a message to Farcaster
  async castMessage(message, signerUuid) {
    try {
      const response = await axios.post(
        `${NEYNAR_BASE_URL}/casts`,
        {
          text: message,
          signer_uuid: signerUuid
        },
        {
          headers: {
            'Authorization': `Bearer ${NEYNAR_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Failed to cast message:', error);
      throw new Error('Failed to share to Farcaster');
    }
  },

  // Generate ritual completion message
  generateRitualCompletionMessage(ritual, streak, points) {
    const messages = [
      `🌟 Just completed my "${ritual.name}" ritual! ${streak} day streak and ${points} points earned. Building resilience one ritual at a time! #ResilienceRituals #MindfulGrowth`,
      `✨ Another day, another ritual! Completed "${ritual.name}" - now at ${streak} days strong! 💪 ${points} points closer to my goals. #DailyRituals #PersonalGrowth`,
      `🎯 Ritual complete: "${ritual.name}" ✅ Streak: ${streak} days | Points: ${points} | Building unbreakable resilience! #MindfulLiving #ResilienceJourney`,
      `🔥 ${streak} days of "${ritual.name}" and counting! Just earned ${points} more points on my resilience journey. Consistency is key! #HabitBuilding #Mindfulness`
    ];
    
    return messages[Math.floor(Math.random() * messages.length)];
  },

  // Generate badge earned message
  generateBadgeMessage(badge) {
    return `🏆 New badge unlocked: "${badge.name}"! ${badge.description} Building resilience through consistent daily rituals! #Achievement #ResilienceRituals #PersonalGrowth`;
  },

  // Generate milestone message
  generateMilestoneMessage(milestone, value) {
    const milestones = {
      streak: `🔥 ${value} day streak achieved! Consistency is the foundation of resilience. Every day matters! #StreakGoals #ResilienceRituals`,
      points: `⭐ ${value} points milestone reached! Each ritual brings me closer to unbreakable emotional resilience. #PointsMilestone #PersonalGrowth`,
      rituals: `🎯 ${value} rituals completed! Building resilience through small, consistent actions every day. #RitualMaster #MindfulLiving`
    };
    
    return milestones[milestone] || `🎉 Milestone achieved: ${value}! #ResilienceRituals #PersonalGrowth`;
  },

  // Check if user can cast (has valid signer)
  canCast(userFid) {
    return userFid && NEYNAR_API_KEY !== 'your-neynar-api-key';
  },

  // Get user's Farcaster profile
  async getUserProfile(fid) {
    try {
      const response = await axios.get(
        `${NEYNAR_BASE_URL}/user`,
        {
          params: { fid },
          headers: {
            'Authorization': `Bearer ${NEYNAR_API_KEY}`
          }
        }
      );
      
      return response.data.result.user;
    } catch (error) {
      console.error('Failed to get user profile:', error);
      return null;
    }
  }
};

// Social sharing utilities
export const socialUtils = {
  // Share ritual completion
  async shareRitualCompletion(ritual, userData, userFid) {
    if (!farcasterService.canCast(userFid)) {
      throw new Error('Farcaster sharing not configured');
    }

    const message = farcasterService.generateRitualCompletionMessage(
      ritual,
      userData.streakCount,
      ritual.points
    );

    return await farcasterService.castMessage(message, userFid);
  },

  // Share badge achievement
  async shareBadgeAchievement(badge, userFid) {
    if (!farcasterService.canCast(userFid)) {
      throw new Error('Farcaster sharing not configured');
    }

    const message = farcasterService.generateBadgeMessage(badge);
    return await farcasterService.castMessage(message, userFid);
  },

  // Share milestone
  async shareMilestone(milestone, value, userFid) {
    if (!farcasterService.canCast(userFid)) {
      throw new Error('Farcaster sharing not configured');
    }

    const message = farcasterService.generateMilestoneMessage(milestone, value);
    return await farcasterService.castMessage(message, userFid);
  }
};
