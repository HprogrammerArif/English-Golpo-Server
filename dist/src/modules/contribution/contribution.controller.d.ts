import { ContributionService, SubmitContributionDto } from './contribution.service';
export declare class ContributionController {
    private readonly contributionService;
    constructor(contributionService: ContributionService);
    submitContribution(user: {
        id: string;
    }, dto: SubmitContributionDto): Promise<{
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
    getMyContributions(user: {
        id: string;
    }): Promise<{
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
