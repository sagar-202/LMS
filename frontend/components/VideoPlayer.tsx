'use client';

import React, { useRef, useState, useEffect } from 'react';
import YouTube, { YouTubeEvent, YouTubePlayer } from 'react-youtube';

interface VideoPlayerProps {
    youtubeVideoId: string;
    startPositionSeconds?: number;
    onProgress?: (seconds: number) => void;
    onCompleted?: () => void;
}

export default function VideoPlayer({
    youtubeVideoId,
    startPositionSeconds = 0,
    onProgress,
    onCompleted
}: VideoPlayerProps) {
    const playerRef = useRef<YouTubePlayer | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const lastProgressReport = useRef<number>(startPositionSeconds);

    // Poll video progress every second while playing
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isPlaying && playerRef.current) {
            interval = setInterval(async () => {
                try {
                    // In raw YT API getCurrentTime returns a number. We await it just in case it's wrapped.
                    const currentTime = await Promise.resolve(playerRef.current.getCurrentTime());

                    if (currentTime - lastProgressReport.current >= 10) {
                        lastProgressReport.current = currentTime;
                        if (onProgress) {
                            onProgress(Math.floor(currentTime));
                        }
                    }
                } catch (error) {
                    console.error('Error fetching current time', error);
                }
            }, 1000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isPlaying, onProgress]);

    const onReady = (event: YouTubeEvent) => {
        playerRef.current = event.target;
        // We expect the playerVars.start config to handle initial seeking,
        // but we can manually reset our tracking value just in case.
        lastProgressReport.current = startPositionSeconds;
    };

    const onStateChange = (event: YouTubeEvent) => {
        const PlayerState = YouTube.PlayerState;
        if (event.data === PlayerState.PLAYING) {
            setIsPlaying(true);
        } else {
            setIsPlaying(false);
        }

        if (event.data === PlayerState.ENDED) {
            if (onCompleted) {
                onCompleted();
            }
        }
    };

    const opts = {
        height: '100%',
        width: '100%',
        playerVars: {
            autoplay: 0,
            start: startPositionSeconds,
            modestbranding: 1,
            rel: 0,
        },
    };

    if (!youtubeVideoId) {
        return (
            <div className="w-full aspect-video bg-black flex items-center justify-center rounded-lg shadow-lg overflow-hidden">
                <div className="text-gray-400">Loading Video...</div>
            </div>
        );
    }

    return (
        <div className="w-full aspect-video bg-black rounded-lg shadow-lg overflow-hidden relative">
            <YouTube
                videoId={youtubeVideoId}
                opts={opts}
                onReady={onReady}
                onStateChange={onStateChange}
                className="absolute top-0 left-0 w-full h-full"
                iframeClassName="w-full h-full"
            />
        </div>
    );
}
