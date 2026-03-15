'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import YouTube, { YouTubeProps, YouTubeEvent } from 'react-youtube';

interface VideoPlayerProps {
    videoId: number | string; // Internal database ID
    youtubeVideoId: string; // The 11-character YouTube ID
    startPositionSeconds?: number;
    onProgress: (seconds: number) => void;
    onCompleted: () => void;
}

export default function VideoPlayer({
    videoId,
    youtubeVideoId,
    startPositionSeconds = 0,
    onProgress,
    onCompleted
}: VideoPlayerProps) {
    const playerRef = useRef<any>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const lastProgressReport = useRef<number>(Math.floor(startPositionSeconds));

    // Callback to send the final progress report when pausing or switching
    const sendFinalProgress = useCallback(() => {
        if (playerRef.current) {
            try {
                const currentTime = Math.floor(playerRef.current.getCurrentTime());
                // Only report if it's different from the last interval report to avoid duplicates
                if (currentTime !== lastProgressReport.current) {
                    onProgress(currentTime);
                    lastProgressReport.current = currentTime;
                }
            } catch (err) {
                // Silently handle cases where player might not be fully ready
            }
        }
    }, [onProgress]);

    // Manage the 10-second progress tracking interval
    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (isPlaying && playerRef.current) {
            interval = setInterval(() => {
                try {
                    const currentTime = Math.floor(playerRef.current.getCurrentTime());

                    // Report every 10 seconds of playback distance from last report
                    if (Math.abs(currentTime - lastProgressReport.current) >= 10) {
                        onProgress(currentTime);
                        lastProgressReport.current = currentTime;
                    }
                } catch (err) {
                    // Ignore errors during interval if player is transitioning
                }
            }, 1000); // Check every second for precision
        }

        return () => {
            if (interval) {
                clearInterval(interval);
                sendFinalProgress();
            }
        };
    }, [isPlaying, onProgress, sendFinalProgress]);

    const onPlayerReady: YouTubeProps['onReady'] = (event: YouTubeEvent) => {
        playerRef.current = event.target;
    };

    const onPlayerStateChange: YouTubeProps['onStateChange'] = (event: YouTubeEvent) => {
        const state = event.data;

        // YouTube.PlayerState: -1: unstarted, 0: ended, 1: playing, 2: paused, 3: buffering, 5: video cued
        if (state === 1) {
            setIsPlaying(true);
        } else {
            setIsPlaying(false);
            // Non-playing states trigger a progress report check (syncs current position)
            sendFinalProgress();
        }
    };

    const onPlayerEnd: YouTubeProps['onEnd'] = (event: YouTubeEvent) => {
        // Fetch current duration to ensure we send the final second
        const duration = event.target.getDuration();
        onProgress(Math.floor(duration));
        onCompleted();
    };

    const opts: YouTubeProps['opts'] = {
        height: '100%',
        width: '100%',
        playerVars: {
            autoplay: 1,
            start: Math.floor(startPositionSeconds),
            modestbranding: 1,
            rel: 0,
            controls: 1,
            origin: typeof window !== 'undefined' ? window.location.origin : '',
        },
    };

    return (
        <div className="w-full aspect-video bg-black rounded-3xl shadow-2xl overflow-hidden relative border border-white/10 group">
            {/* Minimalist Loading State (Placeholder while IFrame loads) */}
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-0">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mb-4">
                        <div className="w-10 h-10 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
                    </div>
                    <span className="text-gray-500 font-bold text-sm tracking-widest uppercase">Initializing Player</span>
                </div>
            </div>

            <YouTube
                videoId={youtubeVideoId}
                opts={opts}
                onReady={onPlayerReady}
                onStateChange={onPlayerStateChange}
                onEnd={onPlayerEnd}
                className="absolute top-0 left-0 w-full h-full z-10"
                iframeClassName="w-full h-full"
            />
        </div>
    );
}
