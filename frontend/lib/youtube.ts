export function getYoutubeVideoId(url: string | undefined | null): string | null {
    if (!url) return null;
    const match = url.match(/(?:v=|\/be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
}

export function getYoutubeThumbnail(url: string | undefined | null): string | null {
    const videoId = getYoutubeVideoId(url);
    if (!videoId) return null;
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}
