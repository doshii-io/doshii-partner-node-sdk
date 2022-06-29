import { AxiosRequestConfig } from "axios";

export interface EmployeeResponse {
    locationId: string;
    posEmployeeId: string;
    firstName: string;
    lastName: string;
    createdAt: string;
    updatedAt: string;
}

export default class Employee {
    readonly requestMaker: (data: AxiosRequestConfig) => Promise<any>;

    constructor(requestMaker: (data: AxiosRequestConfig) => Promise<any>) {
        this.requestMaker = requestMaker;
    }

    private async get(
        locationId: string,
        posEmployeeId?: string
    ): Promise<Array<EmployeeResponse> | EmployeeResponse> {
        const req: AxiosRequestConfig = {
            method: "GET",
            headers: {
                "doshii-location-id": locationId,
            },
        };
        const url = !posEmployeeId ? '/employees' : `/employees/${posEmployeeId}`;

        return await this.requestMaker({
            ...req,
            url
        });
    }

    /**
     * Retrieve a list of employees
     * @param locationId The hashed Location ID of the location you are interacting with
     * @returns a list of all employees
     */
    async getAll(locationId: string): Promise<Array<EmployeeResponse>> {
        return this.get(locationId) as Promise<Array<EmployeeResponse>>;
    }

    /**
     * Retrieve a single employee
     * @param locationId The hashed Location ID of the location you are interacting with
     * @param posEmployeeId  Employee id recorded in the POS
     * @returns requested employee details
     */
    async getOne(locationId: string, posEmployeeId: string): Promise<EmployeeResponse> {
        return this.get(locationId, posEmployeeId) as Promise<EmployeeResponse>;
    }
}
