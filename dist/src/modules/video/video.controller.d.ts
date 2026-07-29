import { VideoService, TrackVideoProgressDto } from './video.service';
export declare class VideoController {
    private readonly videoService;
    constructor(videoService: VideoService);
    getVideos(path?: string, level?: number, page?: number, limit?: number): Promise<{
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
    getMyProgress(user: {
        id: string;
    }): Promise<({
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
    getVideo(id: string): Promise<{
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
        youtubeId: string;
        thumbnailUrl: string;
    }>;
    trackProgress(user: {
        id: string;
    }, dto: TrackVideoProgressDto): Promise<{
        id: string;
        updatedAt: Date;
        userId: string;
        completed: boolean;
        xpEarned: number;
        videoId: string;
        watchedSeconds: number;
    }>;
}
