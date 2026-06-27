import { VideoService, TrackVideoProgressDto } from './video.service';
export declare class VideoController {
    private readonly videoService;
    constructor(videoService: VideoService);
    getVideos(path?: string, level?: number, page?: number, limit?: number): Promise<{
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
    getMyProgress(req: any): Promise<({
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
    trackProgress(req: any, dto: TrackVideoProgressDto): Promise<{
        id: string;
        updatedAt: Date;
        userId: string;
        completed: boolean;
        xpEarned: number;
        videoId: string;
        watchedSeconds: number;
    }>;
}
