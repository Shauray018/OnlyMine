// lib/feed-algorithm.ts

/**
 * Calculate trending score for a post
 * 
 * Formula: (likes + comments × 2) × time_decay
 * Time decay uses half-life of 24 hours
 * 
 * @param likesCount - Number of likes
 * @param commentsCount - Number of comments
 * @param createdAt - Post creation date
 * @returns Trending score (higher = more trending)
 */
export function calculateTrendingScore(
  likesCount: number,
  commentsCount: number,
  createdAt: Date
): number {
  const now = new Date();
  const ageInHours = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
  
  // Engagement score (comments weighted 2x more than likes)
  const engagementScore = likesCount + (commentsCount * 2);
  
  // Time decay: half-life of 24 hours
  // After 24 hours, score is 50% of original
  // After 48 hours, score is 25% of original
  const timeDecay = Math.pow(0.5, ageInHours / 24);
  
  // Final score
  const trendingScore = engagementScore * timeDecay;
  
  return Math.max(0, trendingScore); // Never negative
}

/**
 * Get week number for a given date
 * Format: YYYYWW (e.g., 202443 for year 2024, week 43)
 * 
 * @param date - Date to get week number for (defaults to now)
 * @returns Week number in format YYYYWW
 */
export function getWeekNumber(date: Date = new Date()): number {
  const year = date.getFullYear();
  const start = new Date(year, 0, 1);
  const diff = date.getTime() - start.getTime();
  const oneWeek = 1000 * 60 * 60 * 24 * 7;
  const week = Math.floor(diff / oneWeek) + 1;
  
  return year * 100 + week;
}

/**
 * Get start and end dates for a given week number
 * 
 * @param weekNumber - Week number in format YYYYWW
 * @returns Object with startDate and endDate
 */
export function getWeekDates(weekNumber: number): { startDate: Date; endDate: Date } {
  const year = Math.floor(weekNumber / 100);
  const week = weekNumber % 100;
  
  const startDate = new Date(year, 0, 1);
  const daysToAdd = (week - 1) * 7;
  startDate.setDate(startDate.getDate() + daysToAdd);
  
  // Adjust to start of week (Sunday)
  const dayOfWeek = startDate.getDay();
  startDate.setDate(startDate.getDate() - dayOfWeek);
  startDate.setHours(0, 0, 0, 0);
  
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 7);
  endDate.setHours(23, 59, 59, 999);
  
  return { startDate, endDate };
}

/**
 * Get current week's start date
 * 
 * @returns Date object for start of current week (Sunday at 00:00)
 */
export function getCurrentWeekStart(): Date {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - dayOfWeek);
  weekStart.setHours(0, 0, 0, 0);
  return weekStart;
}

/**
 * Check if a date is within the current week
 * 
 * @param date - Date to check
 * @returns true if date is in current week
 */
export function isCurrentWeek(date: Date): boolean {
  const weekStart = getCurrentWeekStart();
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);
  
  return date >= weekStart && date < weekEnd;
}