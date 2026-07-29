import { PrismaService } from '../../prisma/prisma.service';
export declare class LinkChildDto {
    childPhone: string;
}
export declare class ProvisionB2BDto {
    organizationName: string;
    type: string;
    licenseCount?: number;
    contactPhone?: string;
}
export declare class AccountsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getParentDashboard(parentId: string): Promise<{
        children: {
            id: string;
            name: string;
            learningPath: import("@prisma/client").$Enums.LearningPath | null;
            xpTotal: number;
            level: number;
            streak: number;
            weeklyXp: number;
            storiesCompleted: number;
            wordsBookmarked: number;
            weeklyActivity: {
                completed: boolean;
                date: Date;
                earnedXp: number;
            }[];
        }[];
    }>;
    linkChild(parentId: string, dto: LinkChildDto): Promise<{
        linked: boolean;
        childName: string;
    }>;
    provisionB2B(adminId: string, dto: ProvisionB2BDto): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        type: string;
        licenseCount: number;
        contactPhone: string | null;
        adminId: string;
        contactPerson: string | null;
        customBranding: import("@prisma/client/runtime/client").JsonValue | null;
        nctbClassFocus: number[];
        contractEnd: Date | null;
        monthlyReportDay: number;
    }>;
    getB2BDashboard(adminId: string): Promise<{
        organization: null;
        members?: undefined;
    } | {
        organization: {
            name: string;
            type: string;
            licenseCount: number;
            usedSeats: number;
            availableSeats: number;
            contractEnd: Date | null;
        };
        members: {
            rank: number;
            id: string;
            name: string;
            xpTotal: number;
            level: number;
            streak: number;
            storiesCompleted: number;
            learningPath: import("@prisma/client").$Enums.LearningPath | null;
        }[];
    }>;
}
