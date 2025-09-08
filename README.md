# Resilience Rituals

**Build unbreakable emotional resilience, one ritual at a time.**

A Base mini app that helps users develop emotional resilience through daily habits, gamified engagement, and social accountability via Farcaster integration.

## 🌟 Features

### Core Features
- **Daily Ritual Creator**: Select from a curated library of resilience-building habits
- **Gamified Completion**: Earn points, badges, and maintain streaks
- **Progress Visualization**: Track your resilience journey with detailed analytics
- **Farcaster Social Integration**: Share achievements and build community accountability
- **Mood Tracking**: Monitor emotional state before and after rituals
- **Premium Features**: Advanced rituals, streak savers, and detailed insights

### Technical Features
- **Wallet Integration**: Connect with Base-compatible wallets via RainbowKit
- **Data Persistence**: Supabase backend for reliable data storage
- **Real-time Updates**: Live progress tracking and badge notifications
- **Responsive Design**: Optimized for mobile and desktop experiences
- **Micro-transactions**: $0.50 premium unlock via crypto payments

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- Supabase account and project
- Neynar API key (for Farcaster integration)
- WalletConnect Project ID

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vistara-apps/-app-development-6421.git
   cd -app-development-6421
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your configuration:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   VITE_NEYNAR_API_KEY=your-neynar-api-key
   VITE_WALLETCONNECT_PROJECT_ID=your-walletconnect-project-id
   ```

4. **Set up Supabase database**
   
   Run the following SQL in your Supabase SQL editor:
   
   ```sql
   -- Users table
   CREATE TABLE users (
     userId TEXT PRIMARY KEY,
     farcasterId TEXT,
     createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     streakCount INTEGER DEFAULT 0,
     totalPoints INTEGER DEFAULT 0,
     badgesEarned TEXT[] DEFAULT '{}',
     isPremium BOOLEAN DEFAULT FALSE,
     activeRituals TEXT[] DEFAULT '{}'
   );

   -- Rituals table
   CREATE TABLE rituals (
     ritualId TEXT PRIMARY KEY,
     userId TEXT REFERENCES users(userId) ON DELETE CASCADE,
     name TEXT NOT NULL,
     description TEXT,
     category TEXT DEFAULT 'mindfulness',
     frequency TEXT DEFAULT 'daily',
     completedToday BOOLEAN DEFAULT FALSE,
     streak INTEGER DEFAULT 0,
     createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     lastCompleted TIMESTAMP WITH TIME ZONE
   );

   -- Sessions table (ritual completions)
   CREATE TABLE sessions (
     sessionId TEXT PRIMARY KEY,
     userId TEXT REFERENCES users(userId) ON DELETE CASCADE,
     ritualId TEXT REFERENCES rituals(ritualId) ON DELETE CASCADE,
     timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     moodBefore INTEGER,
     moodAfter INTEGER,
     notes TEXT
   );

   -- Badges table
   CREATE TABLE badges (
     badgeId TEXT PRIMARY KEY,
     name TEXT NOT NULL,
     description TEXT,
     imageUrl TEXT,
     condition JSONB
   );

   -- User badges junction table
   CREATE TABLE user_badges (
     userId TEXT REFERENCES users(userId) ON DELETE CASCADE,
     badgeId TEXT REFERENCES badges(badgeId) ON DELETE CASCADE,
     earnedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     PRIMARY KEY (userId, badgeId)
   );

   -- Insert default badges
   INSERT INTO badges (badgeId, name, description, imageUrl) VALUES
   ('early_bird', 'Early Bird', '7-day morning ritual streak', '/badges/early-bird.svg'),
   ('mindful_master', 'Mindful Master', 'Complete 50 mindfulness rituals', '/badges/mindful-master.svg'),
   ('consistency_champion', 'Consistency Champion', '30-day streak achieved', '/badges/consistency-champion.svg'),
   ('resilience_warrior', 'Resilience Warrior', '100 rituals completed', '/badges/resilience-warrior.svg'),
   ('point_collector', 'Point Collector', '500 points earned', '/badges/point-collector.svg');

   -- Enable Row Level Security
   ALTER TABLE users ENABLE ROW LEVEL SECURITY;
   ALTER TABLE rituals ENABLE ROW LEVEL SECURITY;
   ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
   ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

   -- Create policies (users can only access their own data)
   CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid()::text = userId);
   CREATE POLICY "Users can insert own data" ON users FOR INSERT WITH CHECK (auth.uid()::text = userId);
   CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid()::text = userId);

   CREATE POLICY "Users can view own rituals" ON rituals FOR SELECT USING (auth.uid()::text = userId);
   CREATE POLICY "Users can insert own rituals" ON rituals FOR INSERT WITH CHECK (auth.uid()::text = userId);
   CREATE POLICY "Users can update own rituals" ON rituals FOR UPDATE USING (auth.uid()::text = userId);

   CREATE POLICY "Users can view own sessions" ON sessions FOR SELECT USING (auth.uid()::text = userId);
   CREATE POLICY "Users can insert own sessions" ON sessions FOR INSERT WITH CHECK (auth.uid()::text = userId);

   CREATE POLICY "Users can view own badges" ON user_badges FOR SELECT USING (auth.uid()::text = userId);
   CREATE POLICY "Users can insert own badges" ON user_badges FOR INSERT WITH CHECK (auth.uid()::text = userId);
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Build for production**
   ```bash
   npm run build
   ```

## 📱 Usage

### For Users

1. **Connect Wallet**: Use any Base-compatible wallet to get started
2. **Create Rituals**: Choose from pre-defined rituals or create custom ones
3. **Complete Daily**: Track mood, complete rituals, earn points and badges
4. **Share Progress**: Connect Farcaster to share achievements with your community
5. **Upgrade Premium**: Unlock advanced features for $0.50

### For Developers

The app is built with a modular architecture:

```
src/
├── components/          # Reusable UI components
├── hooks/              # Custom React hooks
├── lib/                # External service integrations
├── App.jsx             # Main application component
└── main.jsx            # Application entry point
```

Key hooks:
- `useAppData()`: Main data management hook
- `usePaymentContext()`: Handles premium upgrades

Key services:
- `supabase.js`: Database operations
- `farcaster.js`: Social sharing integration

## 🔧 API Documentation

### Supabase Database Schema

#### Users Table
```typescript
interface User {
  userId: string;           // Wallet address
  farcasterId?: string;     // Farcaster FID for social features
  createdAt: string;        // ISO timestamp
  streakCount: number;      // Current daily streak
  totalPoints: number;      // Lifetime points earned
  badgesEarned: string[];   // Array of badge IDs
  isPremium: boolean;       // Premium subscription status
  activeRituals: string[];  // Array of active ritual IDs
}
```

#### Rituals Table
```typescript
interface Ritual {
  ritualId: string;         // Unique ritual identifier
  userId: string;           // Owner's wallet address
  name: string;             // Ritual name
  description?: string;     // Ritual description
  category: string;         // 'mindfulness' | 'wellness' | 'mindset' | 'gratitude'
  frequency: string;        // 'daily' (future: 'weekly', 'custom')
  completedToday: boolean;  // Today's completion status
  streak: number;           // Current streak for this ritual
  createdAt: string;        // ISO timestamp
  lastCompleted?: string;   // Last completion timestamp
}
```

#### Sessions Table
```typescript
interface Session {
  sessionId: string;        // Unique session identifier
  userId: string;           // User's wallet address
  ritualId: string;         // Associated ritual ID
  timestamp: string;        // Completion timestamp
  moodBefore?: number;      // Mood rating 1-4 before ritual
  moodAfter?: number;       // Mood rating 1-4 after ritual
  notes?: string;           // User reflection notes
}
```

### Farcaster Integration

#### Neynar API Endpoints

**Cast Message**
```typescript
POST https://api.neynar.com/v1/casts
Headers: {
  Authorization: Bearer ${NEYNAR_API_KEY}
  Content-Type: application/json
}
Body: {
  text: string;           // Message content
  signer_uuid: string;    // User's Farcaster signer
}
```

**Get User Profile**
```typescript
GET https://api.neynar.com/v1/user?fid=${fid}
Headers: {
  Authorization: Bearer ${NEYNAR_API_KEY}
}
```

### Payment Integration

**Create Payment Session**
```typescript
POST https://payments.vistara.dev/api/payment
Headers: {
  Content-Type: application/json
  X-PAYMENT: string;      // Generated by x402-axios
}
Body: {
  amount: string;         // "$0.50"
}
```

## 🎨 Design System

### Colors
- **Background**: `hsl(220, 10%, 95%)`
- **Accent**: `hsl(150, 70%, 45%)` 
- **Primary**: `hsl(220, 80%, 50%)`
- **Surface**: `hsl(220, 10%, 100%)`
- **Text Primary**: `hsl(220, 15%, 15%)`
- **Text Secondary**: `hsl(220, 10%, 40%)`

### Components
- **AppShell**: Main layout with glass morphism effects
- **RitualCard**: Individual ritual display with completion actions
- **ProgressTracker**: Charts and statistics visualization
- **BadgesView**: Achievement display and progress tracking
- **SettingsView**: User preferences and account management

### Animations
- **Float**: Subtle floating animation for background elements
- **Pulse**: Attention-drawing pulse for interactive elements
- **Scale**: Hover effects for cards and buttons

## 🔒 Security & Privacy

- **Wallet-based Authentication**: No passwords or personal data required
- **Row Level Security**: Supabase RLS ensures data isolation
- **Client-side Encryption**: Sensitive data encrypted before storage
- **No PII Collection**: Only wallet addresses and voluntary ritual data
- **GDPR Compliant**: Users can delete all data by disconnecting wallet

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
```bash
npm run build
# Upload dist/ folder to your hosting provider
```

### Docker
```bash
docker build -t resilience-rituals .
docker run -p 3000:3000 resilience-rituals
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow React best practices and hooks patterns
- Use TypeScript for new components when possible
- Maintain responsive design principles
- Test on multiple wallet providers
- Ensure accessibility compliance

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Base Ecosystem**: For providing the infrastructure for onchain apps
- **Farcaster**: For social primitives and community features
- **Supabase**: For reliable backend-as-a-service
- **RainbowKit**: For seamless wallet integration
- **Tailwind CSS**: For utility-first styling

## 📞 Support

- **Documentation**: [Link to docs]
- **Discord**: [Community server]
- **Twitter**: [@ResilienceRituals]
- **Email**: support@resiliencerituals.app

---

**Built with ❤️ for the Base ecosystem**

*Building unbreakable emotional resilience, one ritual at a time.*
