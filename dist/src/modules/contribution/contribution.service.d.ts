import { PrismaService } from '../../prisma/prisma.service';
export declare class SubmitContributionDto {
    contentType: string;
    title: string;
    description?: string;
    fileUrl: string;
    targetChildId?: string;
}
export declare class ContributionService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    submitContribution(userId: string, dto: SubmitContributionDto): Promise<{
        id: string;
        title: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        contributorId: string;
        targetChildId: string | null;
        payoutAmount: number;
        payoutStatus: string;
        status: string;
        contentType: string;
        fileUrl: string;
    }>;
    getMyContributions(userId: string): Promise<{
        id: string;
        title: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        contributorId: string;
        targetChildId: string | null;
        payoutAmount: number;
        payoutStatus: string;
        status: string;
        contentType: string;
        fileUrl: string;
    }[]>;
}
