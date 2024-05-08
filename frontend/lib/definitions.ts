// definitions.ts

export interface SystemUser {
    userID: number;
    name: string;
    email: string;
    role: "admin" | "student" | "advisor";
    password: string;
}