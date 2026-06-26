import { AccountsService, LinkChildDto, ProvisionB2BDto } from './accounts.service';
export declare class AccountsController {
    private readonly accountsService;
    constructor(accountsService: AccountsService);
    getParentDashboard(user: {
        id: string;
    }): Promise<{
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
    linkChild(user: {
        id: string;
    }, dto: LinkChildDto): Promise<{
        linked: boolean;
        childName: string;
    }>;
    provisionB2B(user: {
        id: string;
    }, dto: ProvisionB2BDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
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
    getB2BDashboard(user: {
        id: string;
    }): Promise<{
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
