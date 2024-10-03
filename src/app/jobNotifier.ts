import { ApiClient } from './apiClient';
import {Result} from './interface';

/**
 * JobNotifier is responsible for fetching new job listings and notifying the user.
 */
export class JobNotifier {
    private apiClient: ApiClient;
    private readonly requestPayload: any; // GraphQL request payload for fetching job listings
    // Store job objects by their ID
    public availableJobs: Map<string, Result> = new Map();


    /**
     * Creates an instance of JobNotifier with the specified API client.
     * @param baseURL - The base URL of the API.
     */
    constructor(baseURL: string) {
        this.apiClient = new ApiClient(baseURL);
        this.requestPayload = {
            query: `
                query($limit: Int, $toTime: String) {
                    mostRecentJobsFeed(limit: $limit, toTime: $toTime) {
                        results {
                            id
                            uid: id
                            title
                            ciphertext
                            description
                            type
                            recno
                            freelancersToHire
                            duration
                            engagement
                            amount {
                                amount
                            }
                            createdOn: createdDateTime
                            publishedOn: publishedDateTime
                            prefFreelancerLocationMandatory
                            connectPrice
                            client {
                                totalHires
                                totalSpent
                                paymentVerificationStatus
                                location {
                                    country
                                }
                                totalReviews
                                totalFeedback
                                hasFinancialPrivacy
                            }
                            tierText
                            tier
                            tierLabel
                            proposalsTier
                            enterpriseJob
                            premium
                            jobTs: jobTime
                            attrs: skills {
                                id
                                uid: id
                                prettyName: prefLabel
                                prefLabel
                            }
                            hourlyBudget {
                                type
                                min
                                max
                            }
                            isApplied
                            read
                        }
                        paging {
                            total
                            count
                            resultSetTs: minTime
                            maxTime
                        }
                    }
                }
            `,
            variables: {
                limit: 10 // Limit the number of job listings returned
            }
        };

        // Set an alarm to check for new jobs periodically (e.g., every 15 minutes)
        chrome.alarms.create('checkJobs', { periodInMinutes: 15 });
    }

    /**
     * Fetches new jobs and notifies the user about them.
     * @returns A promise that resolves when the jobs are fetched and notifications are sent.
     */
    async checkForNewJobs(): Promise<void> {
        try {
            // Step 1: Make the initial request to log in
            await this.apiClient.makeInitialRequest('/ab/account-security/login');

            // Step 2: Make a subsequent request to fetch available jobs
            const response = await this.apiClient.makeSubsequentRequest('/api/graphql/v1', this.requestPayload);
            const jobs: Result[] = response.data.data.results;

            // Filter out jobs that are already in the availableJobs set
            const newJobs = jobs.filter(job => !this.availableJobs.has(job.id));

            // Add the new jobs' IDs to the availableJobs set
            newJobs.forEach(job => this.availableJobs.set(job.id, job));

            if (newJobs.length > 0) {
                this.notifyUser(newJobs); // Notify the user with the job data
            }
        } catch (error) {
            console.error('Error fetching or notifying jobs:', error);
        }
    }

    /**
     * Notifies the user about new jobs by creating a single Chrome notification.
     * @param jobs - An array of job objects to notify the user about.
     */
    private notifyUser(jobs: Result[]): void {
        // Send a single notification with the total number of new jobs available
        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'assets/icon.png',
            title: `New Jobs Available`,
            message: `${jobs.length} new job(s) found. click here for details`,
            priority: 1
        });

        // Mark the jobs as read after notifying
        jobs.forEach(job => job.read = true);
    }

    /**
     * Listens for Chrome alarm events to trigger job checking.
     */
    public listenForAlarms(): void {
        chrome.alarms.onAlarm.addListener((alarm) => {
            if (alarm.name === 'checkJobs') {
                this.checkForNewJobs(); // Check for new jobs when the alarm is triggered
            }
        });
    }
}
