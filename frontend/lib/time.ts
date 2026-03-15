/**
 * Formats a duration in seconds to a human-readable string.
 * Example: 3660 -> "1h 1m", 1500 -> "25m"
 */
export const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
};
