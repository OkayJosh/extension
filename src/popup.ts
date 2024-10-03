

// Create a new instance of JobNotifier
import {JobNotifier} from "./app/jobNotifier";
import {Result} from "./app/interface";

const jobNotifier = new JobNotifier('https://www.upwork.com');


// Function to render jobs in the job list
function renderJobs(jobs: Result[]): void {
    const jobList = document.getElementById('job-list') as HTMLUListElement;
    jobList.innerHTML = ''; // Clear the current job list

    jobs.forEach(job => {
        const listItem = document.createElement('li');
        listItem.textContent = `${job.title} - ${job.amount.amount} (Read: ${job.read})`;
        jobList.appendChild(listItem);
    });
}

// Function to fetch available jobs
async function fetchAvailableJobs(): Promise<void> {
    try {
        await jobNotifier.checkForNewJobs();
        const availableJobs = Array.from(jobNotifier.availableJobs.values()); // Convert Set to Array and assert type
        renderJobs(availableJobs); // Render jobs in the popup
    } catch (error) {
        console.error('Error fetching jobs:', error);
    }
}

// Event listener for the refresh button
document.getElementById('refresh-jobs')?.addEventListener('click', fetchAvailableJobs);

// Initial load of jobs when the popup is opened
fetchAvailableJobs();
