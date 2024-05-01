// utils/config.ts

export function parsePort(port: string | undefined): number {
    const defaultPort = 5432;
    if (!port) {
        return defaultPort;
    }

    const parsedPort = parseInt(port, 10);
    if (isNaN(parsedPort)) {
        // Optionally log or handle the error here
        console.error(`Invalid DB_PORT "${port}", defaulting to ${defaultPort}`);
        return defaultPort;
    }

    return parsedPort;
}
