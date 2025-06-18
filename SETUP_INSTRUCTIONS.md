# Anime Diary - Setup Instructions

## Database Setup

### 1. Create Supabase Tables

Run the following SQL queries in your Supabase SQL editor:

```sql
-- Enable Row Level Security (RLS)
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create watchlist table
CREATE TABLE IF NOT EXISTS watchlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  anime_id INTEGER NOT NULL,
  anime_title TEXT NOT NULL,
  anime_cover_image TEXT,
  anime_description TEXT,
  anime_genres TEXT[],
  anime_status TEXT,
  anime_episodes INTEGER,
  anime_duration INTEGER,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, anime_id)
);

-- Create watched table
CREATE TABLE IF NOT EXISTS watched (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  anime_id INTEGER NOT NULL,
  anime_title TEXT NOT NULL,
  anime_cover_image TEXT,
  anime_description TEXT,
  anime_genres TEXT[],
  anime_status TEXT,
  anime_episodes INTEGER,
  anime_duration INTEGER,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  rating INTEGER CHECK (rating >= 1 AND rating <= 10),
  notes TEXT,
  UNIQUE(user_id, anime_id)
);

-- Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  anime_id INTEGER NOT NULL,
  anime_title TEXT NOT NULL,
  anime_cover_image TEXT,
  anime_description TEXT,
  anime_genres TEXT[],
  anime_status TEXT,
  anime_episodes INTEGER,
  anime_duration INTEGER,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, anime_id)
);

-- Enable Row Level Security on all tables
ALTER TABLE watchlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE watched ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for watchlist
CREATE POLICY "Users can view their own watchlist" ON watchlist
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own watchlist items" ON watchlist
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own watchlist items" ON watchlist
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own watchlist items" ON watchlist
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for watched
CREATE POLICY "Users can view their own watched items" ON watched
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own watched items" ON watched
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own watched items" ON watched
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own watched items" ON watched
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for favorites
CREATE POLICY "Users can view their own favorites" ON favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites" ON favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own favorites" ON favorites
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites" ON favorites
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_watchlist_user_id ON watchlist(user_id);
CREATE INDEX IF NOT EXISTS idx_watchlist_anime_id ON watchlist(anime_id);
CREATE INDEX IF NOT EXISTS idx_watched_user_id ON watched(user_id);
CREATE INDEX IF NOT EXISTS idx_watched_anime_id ON watched(anime_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_anime_id ON favorites(anime_id);
```

## Features Implemented

### 1. Database Tables

- **watchlist**: Stores anime that users want to watch
- **watched**: Stores completed anime with ratings and notes
- **favorites**: Stores user's favorite anime

### 2. TypeScript Types

- Complete type definitions for all data structures
- Proper interfaces for database entities and API responses

### 3. Database Queries

- CRUD operations for all three tables
- User-specific data access with Row Level Security
- Stats calculation for dashboard

### 4. Components

- **AnimeCard**: Reusable component with action buttons
- **DashboardStats**: Real-time stats display
- **Navigation**: Updated with new page links

### 5. Pages

- **/watchlist**: Display user's watchlist
- **/watched**: Display completed anime with ratings/notes
- **/favorites**: Display favorite anime
- **/trending**: Updated with action buttons

### 6. Features

- Add/remove anime from watchlist, watched, and favorites
- Rate completed anime (1-10 scale)
- Add notes to completed anime
- Real-time status checking
- Responsive design with loading states
- Error handling

## Usage

1. **Adding to Watchlist**: Click "Add to Watchlist" on any anime card
2. **Marking as Watched**: Click "Mark Watched" to add to completed list
3. **Rating Anime**: On the watched page, click "Add Rating" to rate and add notes
4. **Adding to Favorites**: Click the heart icon to favorite an anime
5. **Viewing Lists**: Use the navigation links to view your lists

## Security

- Row Level Security (RLS) ensures users can only access their own data
- All database operations are user-scoped
- Authentication required for all list operations

## Performance

- Database indexes for fast queries
- Optimistic UI updates
- Efficient data fetching with proper error handling
- Responsive loading states

## Architecture

- Clean separation of concerns
- Reusable components
- Type-safe database operations
- Consistent design system
- Modern React patterns with hooks
