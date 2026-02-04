// Cached/Fallback Content Manager for Offline Courses

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Types for cached content
export interface CachedCourse {
    id: string;
    topic: string;
    title: string;
    description: string;
    difficulty: string;
    lessons: CachedLesson[];
    createdAt: Date;
    accessCount: number;
}

export interface CachedLesson {
    id: string;
    title: string;
    content: string;
    order: number;
    questions: CachedQuestion[];
}

export interface CachedQuestion {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
}

// Popular topics that should always have cached content
const POPULAR_TOPICS = [
    'JavaScript Fundamentals',
    'React Basics',
    'Python for Beginners',
    'Data Structures',
    'System Design',
    'SQL Fundamentals',
    'Git & GitHub',
    'REST API Design',
    'TypeScript Essentials',
    'Node.js Basics'
];

class FallbackContentManager {
    private inMemoryCache: Map<string, CachedCourse> = new Map();
    private cacheHits: number = 0;
    private cacheMisses: number = 0;

    // Check if we have cached content for a topic
    async hasCachedContent(topic: string): Promise<boolean> {
        const normalizedTopic = this.normalizeTopic(topic);

        // Check memory cache first
        if (this.inMemoryCache.has(normalizedTopic)) {
            return true;
        }

        // Check database
        try {
            const cached = await prisma.cachedCourse.findFirst({
                where: {
                    topic: { contains: normalizedTopic, mode: 'insensitive' }
                }
            });
            return !!cached;
        } catch {
            return false;
        }
    }

    // Get cached content for a topic
    async getCachedContent(topic: string): Promise<CachedCourse | null> {
        const normalizedTopic = this.normalizeTopic(topic);

        // Check memory cache
        if (this.inMemoryCache.has(normalizedTopic)) {
            this.cacheHits++;
            const course = this.inMemoryCache.get(normalizedTopic)!;
            this.incrementAccessCount(course.id);
            return course;
        }

        // Check database
        try {
            const cached = await prisma.cachedCourse.findFirst({
                where: {
                    topic: { contains: normalizedTopic, mode: 'insensitive' }
                },
                include: {
                    lessons: {
                        include: { questions: true },
                        orderBy: { order: 'asc' }
                    }
                }
            });

            if (cached) {
                this.cacheHits++;
                const course = this.transformToCachedCourse(cached);
                this.inMemoryCache.set(normalizedTopic, course);
                this.incrementAccessCount(cached.id);
                return course;
            }
        } catch (error) {
            console.error('Failed to retrieve cached content:', error);
        }

        this.cacheMisses++;
        return null;
    }

    // Cache a newly generated course
    async cacheContent(course: CachedCourse): Promise<void> {
        const normalizedTopic = this.normalizeTopic(course.topic);

        try {
            // Store in database
            await prisma.cachedCourse.upsert({
                where: { topic: normalizedTopic },
                create: {
                    topic: normalizedTopic,
                    title: course.title,
                    description: course.description,
                    difficulty: course.difficulty,
                    content: JSON.stringify(course.lessons),
                    accessCount: 0
                },
                update: {
                    title: course.title,
                    description: course.description,
                    content: JSON.stringify(course.lessons),
                    updatedAt: new Date()
                }
            });

            // Update memory cache
            this.inMemoryCache.set(normalizedTopic, course);

            console.log(`Cached course: ${course.title}`);
        } catch (error) {
            console.error('Failed to cache content:', error);
        }
    }

    // Get a random fallback course when all else fails
    async getRandomFallbackCourse(): Promise<CachedCourse | null> {
        try {
            const courses = await prisma.cachedCourse.findMany({
                take: 10,
                orderBy: { accessCount: 'desc' }
            });

            if (courses.length === 0) return null;

            const randomIndex = Math.floor(Math.random() * courses.length);
            return this.transformToCachedCourse(courses[randomIndex]);
        } catch {
            return null;
        }
    }

    // Get suggested topics (popular cached topics)
    async getSuggestedTopics(): Promise<string[]> {
        try {
            const cached = await prisma.cachedCourse.findMany({
                select: { topic: true, accessCount: true },
                orderBy: { accessCount: 'desc' },
                take: 20
            });

            return cached.map(c => c.topic);
        } catch {
            return POPULAR_TOPICS;
        }
    }

    // Get cache statistics
    getStats(): { hits: number; misses: number; hitRate: number; cachedTopics: number } {
        const total = this.cacheHits + this.cacheMisses;
        return {
            hits: this.cacheHits,
            misses: this.cacheMisses,
            hitRate: total > 0 ? (this.cacheHits / total) * 100 : 0,
            cachedTopics: this.inMemoryCache.size
        };
    }

    // Pre-warm cache with popular topics
    async prewarmCache(): Promise<void> {
        console.log('Pre-warming content cache...');

        try {
            const courses = await prisma.cachedCourse.findMany({
                orderBy: { accessCount: 'desc' },
                take: 50,
                include: {
                    lessons: {
                        include: { questions: true }
                    }
                }
            });

            for (const course of courses) {
                const cached = this.transformToCachedCourse(course);
                this.inMemoryCache.set(this.normalizeTopic(course.topic), cached);
            }

            console.log(`Pre-warmed ${courses.length} courses into cache`);
        } catch (error) {
            console.error('Cache pre-warm failed:', error);
        }
    }

    // Helpers
    private normalizeTopic(topic: string): string {
        return topic.toLowerCase().trim().replace(/\s+/g, '-');
    }

    private async incrementAccessCount(courseId: string): Promise<void> {
        try {
            await prisma.cachedCourse.update({
                where: { id: courseId },
                data: { accessCount: { increment: 1 } }
            });
        } catch {
            // Silent fail for analytics
        }
    }

    private transformToCachedCourse(dbCourse: any): CachedCourse {
        return {
            id: dbCourse.id,
            topic: dbCourse.topic,
            title: dbCourse.title,
            description: dbCourse.description,
            difficulty: dbCourse.difficulty,
            lessons: typeof dbCourse.content === 'string'
                ? JSON.parse(dbCourse.content)
                : dbCourse.lessons || [],
            createdAt: dbCourse.createdAt,
            accessCount: dbCourse.accessCount
        };
    }
}

export const fallbackContent = new FallbackContentManager();

// Pre-warm on startup
fallbackContent.prewarmCache();
