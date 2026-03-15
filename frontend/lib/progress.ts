import { lmsApi } from './api';

/**
 * Utility to manage video progress updates with debouncing.
 * Ensures we don't spam the backend with every small progress tick.
 */

// Store last sent timestamp per video to manage debouncing
const lastSentTimestamps: Record<string | number, number> = {};
const DEBOUNCE_MS = 10000; // 10 seconds

/**
 * Sends video progress to the backend.
 * Implementation uses a 10s debounce: if called frequently, 
 * it only sends to the backend once every 10 seconds.
 * Force sends if isCompleted is true.
 */
export const sendProgress = async (
    videoId: number | string,
    seconds: number,
    isCompleted: boolean = false
) => {
    const now = Date.now();
    const lastSent = lastSentTimestamps[videoId] || 0;

    // Send immediately if:
    // 1. It's marked as completed
    // 2. It's been more than DEBOUNCE_MS since the last update
    if (isCompleted || (now - lastSent >= DEBOUNCE_MS)) {
        try {
            await lmsApi.updateVideoProgress(videoId, {
                last_position_seconds: Math.floor(seconds),
                is_completed: isCompleted
            });
            lastSentTimestamps[videoId] = now;
        } catch (error) {
            console.error(`[Progress] Failed to sync progress for video ${videoId}:`, error);
        }
    }
};

/**
 * Marks a video as completed immediately.
 */
export const markVideoCompleted = async (videoId: number | string, seconds: number) => {
    return sendProgress(videoId, seconds, true);
};
