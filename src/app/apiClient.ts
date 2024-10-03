import axios, {  } from 'axios';
import AxiosXHR = Axios.AxiosXHR;
import {Response} from './interface';

/**
 * ApiClient is a class responsible for making HTTP requests to a specified base URL.
 * It handles both initial requests to obtain headers and subsequent requests using those headers.
 */
export class ApiClient {
    private baseURL: string; // Base URL for the API
    private initialHeaders: Record<string, string> = {}; // Headers stored from the initial request

    /**
     * Creates an instance of ApiClient with a specified base URL.
     * @param baseURL - The base URL for the API.
     */
    constructor(baseURL: string) {
        this.baseURL = baseURL;
    }

    /**
     * Makes an initial POST request to the specified endpoint and stores the response headers.
     * @param endpoint - The API endpoint to call.
     * @param data - Optional data to be sent in the request body.
     * @returns A promise that resolves when the request is complete.
     * @throws An error if the request fails.
     */
    async makeInitialRequest(endpoint: string, data?: any): Promise<void> {
        try {
            const response: AxiosXHR<Response> = await axios.post(`${this.baseURL}${endpoint}`, data);
            this.initialHeaders = response.headers; // Store response headers for future requests
            console.log('Initial request successful, headers saved:', this.initialHeaders);
        } catch (error) {
            console.error('Error making initial request:', error);
            throw error; // Rethrow the error for further handling
        }
    }

    /**
     * Makes a subsequent POST request to the specified endpoint using the stored headers from the initial request.
     * @param endpoint - The API endpoint to call.
     * @param data - Optional data to be sent in the request body.
     * @returns A promise that resolves to the Axios response.
     * @throws An error if the request fails.
     */
    async makeSubsequentRequest(endpoint: string, data?: any): Promise<AxiosXHR<Response>> {
        try {
            const config = {
                headers: this.initialHeaders, // Use stored headers
            };

            const response: AxiosXHR<Response> = await axios.post(`${this.baseURL}${endpoint}`, data, config);
            console.log('Subsequent request successful:', response.data);
            return response;
        } catch (error) {
            console.error('Error making subsequent request:', error);
            throw error; // Rethrow the error for further handling
        }
    }
}
