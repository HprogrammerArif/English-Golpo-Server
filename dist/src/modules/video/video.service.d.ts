import { PrismaService } from '../../prisma/prisma.service';
import { LearningPath } from '@prisma/client';
export declare class GetVideosDto {
    path?: LearningPath;
    level?: number;
    page?: number;
    limit?: number;
    type?: string;
}
export declare class TrackVideoProgressDto {
    videoId: string;
    watchedSeconds: number;
    completed: boolean;
}
export declare class VideoService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getVideos(userId: string, dto: GetVideosDto): Promise<{
        videos: {
            id: string;
            title: string;
            titleBn: string;
            description: string;
            descriptionBn: string;
            level: number;
            learningPath: import("@prisma/client").$Enums.LearningPath;
            isPremium: boolean;
            nctbClass: number | null;
            durationSeconds: number;
            tags: string[];
            isPublished: boolean;
            createdAt: Date;
            youtubeId: string | null;
            thumbnailUrl: string;
            videoType: import("@prisma/client").$Enums.VideoType;
            videoUrl: string | null;
            contributorId: string | null;
            targetChildId: string | null;
            approved: boolean;
            payoutAmount: number;
            payoutStatus: string;
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
        title: string;
        titleBn: string;
        description: string;
        descriptionBn: string;
        level: number;
        learningPath: import("@prisma/client").$Enums.LearningPath;
        isPremium: boolean;
        nctbClass: number | null;
        durationSeconds: number;
        tags: string[];
        isPublished: boolean;
        createdAt: Date;
        youtubeId: string | null;
        thumbnailUrl: string;
        videoType: import("@prisma/client").$Enums.VideoType;
        videoUrl: string | null;
        contributorId: string | null;
        targetChildId: string | null;
        approved: boolean;
        payoutAmount: number;
        payoutStatus: string;
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
