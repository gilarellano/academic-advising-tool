// data.ts
import 'server-only';

import { unstable_noStore as noStore } from "next/cache";

const BASE_URL = 'http://54.215.48.100:3001';

// Function to fetch all users
export async function fetchUsers(page = 1, limit = 10) {
    noStore();

    try {
        const response = await fetch(`${BASE_URL}/users?page=${page}&limit=${limit}`);
        if (!response.ok) throw new Error('Failed to fetch users');
        const result = await response.json();
        const nextOffset = result.data.length === limit ? page + 1 : null; // Calculate next page offset
        return {
            users: result.data,
            offset: nextOffset
        };
    } catch (error) {
        console.error('Fetch Error:', error);
        throw new Error('Failed to fetch users');
    }
}
  
// Function to update a user by ID
export async function updateUserName(userId: number, userName: string) {
    noStore()
  try {
    const response = await fetch(`${BASE_URL}/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userName),
    });
    if (!response.ok) throw new Error('Failed to update user');
    const updatedUser = await response.json();
    return updatedUser;
  } catch (error) {
    console.error('Fetch Error:', error);
    throw new Error('Failed to update user');
  }
}

// Function to fetch a single user by ID
export async function fetchUserById(userId: number) {
  noStore();
  try {
    const response = await fetch(`${BASE_URL}/users/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch user');
    const user = await response.json();
    return user;
  } catch (error) {
    console.error('Fetch Error:', error);
    throw new Error('Failed to fetch user');
  }
}
