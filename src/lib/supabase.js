import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database schema types
export const TABLES = {
  USERS: 'users',
  RITUALS: 'rituals',
  SESSIONS: 'sessions',
  BADGES: 'badges',
  USER_BADGES: 'user_badges'
};

// Helper functions for database operations
export const dbHelpers = {
  // User operations
  async createUser(userData) {
    const { data, error } = await supabase
      .from(TABLES.USERS)
      .insert([userData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getUser(userId) {
    const { data, error } = await supabase
      .from(TABLES.USERS)
      .select('*')
      .eq('userId', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async updateUser(userId, updates) {
    const { data, error } = await supabase
      .from(TABLES.USERS)
      .update(updates)
      .eq('userId', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Ritual operations
  async getUserRituals(userId) {
    const { data, error } = await supabase
      .from(TABLES.RITUALS)
      .select('*')
      .eq('userId', userId)
      .order('createdAt', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async createRitual(ritualData) {
    const { data, error } = await supabase
      .from(TABLES.RITUALS)
      .insert([ritualData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateRitual(ritualId, updates) {
    const { data, error } = await supabase
      .from(TABLES.RITUALS)
      .update(updates)
      .eq('ritualId', ritualId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Session operations
  async createSession(sessionData) {
    const { data, error } = await supabase
      .from(TABLES.SESSIONS)
      .insert([sessionData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getUserSessions(userId, limit = 50) {
    const { data, error } = await supabase
      .from(TABLES.SESSIONS)
      .select('*, rituals(name)')
      .eq('userId', userId)
      .order('timestamp', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data || [];
  },

  // Badge operations
  async getUserBadges(userId) {
    const { data, error } = await supabase
      .from(TABLES.USER_BADGES)
      .select('*, badges(*)')
      .eq('userId', userId);
    
    if (error) throw error;
    return data?.map(item => item.badges) || [];
  },

  async awardBadge(userId, badgeId) {
    const { data, error } = await supabase
      .from(TABLES.USER_BADGES)
      .insert([{ userId, badgeId }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};
