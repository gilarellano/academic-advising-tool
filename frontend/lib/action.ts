'use server';

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const BASE_URL = 'http://localhost:3001';
const UserSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email({ message: 'Invalid email format'}),
    role: z.enum(['admin', 'student', 'advisor'], {
        invalid_type_error: 'Please select role type',
    }),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
});

// Function to check if the email already exists
export async function checkEmail(email: string): Promise<boolean> {
    const response = await fetch(`${BASE_URL}/check-email?email=${encodeURIComponent(email)}`);
    const data = await response.json();
    return data.exists;
}

// Function to create a new user
export async function createUser(userData: z.infer<typeof UserSchema>) {
    try {
        // Validate userData with Zod
        const validData = UserSchema.parse(userData);

        // Check if email is already in use
        const emailInUse = await checkEmail(validData.email);
        if (emailInUse) {
            throw new Error('Email is already in use.');
        }

        // Making the API call
        const response = await fetch(`${BASE_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(validData),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        console.error('Error:', error);
        throw new Error('Failed to create user');
    }
    revalidatePath('/dashboard');
    redirect('/dashboard');
}


// Function to delete a user by ID
export async function deleteUser(userId: number) {
    const response = await fetch(`${BASE_URL}/users/${userId}`, {
      method: 'DELETE',
    });
    //if (!response.ok) throw new Error('Failed to delete user');
    console.log(`Deleted User: ${userId}`);
    revalidatePath('/dashboard');
}