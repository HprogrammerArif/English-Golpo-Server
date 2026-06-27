import { PrismaService } from '../../prisma/prisma.service';
import { LearningPath } from '@prisma/client';
export declare class GetVideosDto {
    path?: LearningPath;
    level?: number;
    page?: number;
    limit?: number;
}
export declare class TrackVideoProgressDto {
    videoId: string;
    watchedSeconds: number;
    completed: boolean;
}
export declare class VideoService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getVideos(dto: GetVideosDto): Promise<{
        videos: {
            id: string;
            learningPath: import("@prisma/client").$Enums.LearningPath;
            nctbClass: number | null;
            createdAt: Date;
            title: string;
            titleBn: string;
            description: string;
            descriptionBn: string;
            level: number;
            isPremium: boolean;
            durationSeconds: number;
            tags: string[];
            isPublished: boolean;
            youtubeId: string;
            thumbnailUrl: string;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getVideoById(id: string): Promise<{
        id: string;
        learningPath: import("@prisma/client").$Enums.LearningPath;
        nctbClass: number | null;
        createdAt: Date;
        title: string;
        titleBn: string;
        description: string;
        descriptionBn: string;
        level: number;
        isPremium: boolean;
        durationSeconds: number;
        tags: string[];
        isPublished: boolean;
        youtubeId: string;
        thumbnailUrl: string;
    }>;
    getUserVideoProgress(userId: string): Promise<({
        video: {
            id: string;
            title: string;
            titleBn: string;
            durationSeconds: number;
            thumbnailUrl: string;
        };
    } & {
        id: string;
        updatedAt: Date;
        userId: string;
        completed: boolean;
        xpEarned: number;
        videoId: string;
        watchedSeconds: number;
    })[]>;
    trackProgress(userId: string, dto: TrackVideoProgressDto): Promise<{
        id: string;
        updatedAt: Date;
        userId: string;
        completed: boolean;
        xpEarned: number;
        videoId: string;
        watchedSeconds: number;
    }>;
}
