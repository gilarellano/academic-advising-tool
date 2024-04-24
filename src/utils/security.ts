// security.ts
import bcrypt from 'bcrypt';

export function sanitizeInput(input: string): string {
    // Trim whitespace at both ends of the string
    const trimmed = input.trim();

    // Escape potentially dangerous characters
    const escaped = trimmed.replace(/[&<>"'#]/g, match => {
        switch (match) {
            case '&': return '&amp;';
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '"': return '&quot;';
            case "'": return '&#39;';
            default: return match;
        }
    });

    return escaped;
}


export async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
}
