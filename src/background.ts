import {JobNotifier} from "./app/jobNotifier";


const jobNotifier = new JobNotifier('https://www.upwork.com');
jobNotifier.listenForAlarms(); // Start listening for alarms
