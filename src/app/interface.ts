/**
 * Represents the location of a client.
 */
export interface Location {
    country: string;
}

/**
 * Represents the client details associated with a job.
 */
export interface Client {
    totalHires: number;
    totalSpent: number;
    paymentVerificationStatus: string;
    location: Location;
    totalReviews: number;
    totalFeedback: number;
    hasFinancialPrivacy: boolean;
}

/**
 * Represents the amount associated with a job.
 */
export interface Amount {
    amount: number;
}

/**
 * Represents the hourly budget details of a job.
 */
export interface HourlyBudget {
    type: string;
    min: number;
    max: number;
}

/**
 * Represents the attributes of skills related to a job.
 */
export interface Skill {
    id: string;
    uid: string;
    prettyName: string;
    prefLabel: string;
}

/**
 * Represents a job listing with a read attribute to indicate if it has been viewed.
 */
export interface Result {
    id: string;
    uid: string;
    title: string;
    ciphertext: string;
    description: string;
    type: string;
    recno: number;
    freelancersToHire: number;
    duration: string;
    engagement: string;
    amount: Amount;
    createdOn: string;
    publishedOn: string;
    prefFreelancerLocationMandatory: boolean;
    connectPrice: number;
    client: Client;
    tierText: string;
    tier: string;
    tierLabel: string;
    proposalsTier: string;
    enterpriseJob: boolean;
    premium: boolean;
    jobTs: string;
    attrs: Skill[];
    hourlyBudget: HourlyBudget;
    isApplied: boolean;
    read: boolean; // Indicates if the result has been viewed
}

export interface MostRecentJobsFeed {
    results: Result[];
}


export interface Response {
    data: MostRecentJobsFeed;
}