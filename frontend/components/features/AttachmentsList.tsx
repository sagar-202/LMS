'use client';

import React, { useState, useEffect } from 'react';
import { lmsApi, Attachment } from '@/lib/api';
import { FileText, Archive, File as FileIcon, ExternalLink } from 'lucide-react';

interface AttachmentsListProps {
  lessonId: number | string;
}

export default function AttachmentsList({ lessonId }: AttachmentsListProps) {
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAttachments = async () => {
            setLoading(true);
            try {
                const data = await lmsApi.getAttachments(lessonId);
                setAttachments(data);
                setError(null);
            } catch (err) {
                console.error('Failed to fetch attachments:', err);
                setError('Failed to load attachments');
            } finally {
                setLoading(false);
            }
        };

        if (lessonId) {
            fetchAttachments();
        }
    }, [lessonId]);

    const getFileIcon = (type: string) => {
        switch (type.toLowerCase()) {
            case 'pdf': return <FileText className="w-5 h-5 text-red-500" />;
            case 'zip': return <Archive className="w-5 h-5 text-yellow-500" />;
            case 'doc':
            case 'docx': return <FileIcon className="w-5 h-5 text-blue-500" />;
            default: return <FileIcon className="w-5 h-5 text-gray-500" />;
        }
    };

    if (loading) {
        return (
            <div className="space-y-2">
                {[1, 2].map(i => (
                    <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />
                ))}
            </div>
        );
    }

    if (error) {
        return <div className="text-sm text-red-500 bg-red-50 p-3 rounded-lg">{error}</div>;
    }

    if (attachments.length === 0) {
        return (
            <div className="text-sm text-gray-500 italic bg-gray-50 p-3 rounded-lg">
                No supplemental materials available for this lesson.
            </div>
        );
    }

    const formatAttachmentName = (url: string) => {
        try {
            const cleanUrl = url.replace(/\/+$/, '');
            const slug = cleanUrl.split('/').pop() || 'Resource';
            const withoutExt = slug.replace(/\.[^/.]+$/, "");
            const unsluggified = withoutExt.replace(/[-_]/g, ' ');
            return unsluggified.replace(/\b\w/g, c => c.toUpperCase()) || 'Lesson Material';
        } catch {
            return 'Lesson Material';
        }
    };

    return (
        <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Lesson Materials</h3>
            <div className="grid gap-2">
                {attachments.map((attachment) => (
                    <a
                        key={attachment.id}
                        href={attachment.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all group"
                    >
                        <div className="flex items-center gap-3">
                            {getFileIcon(attachment.file_type)}
                            <span className="text-sm font-medium text-gray-700 truncate max-w-[200px]">
                                {formatAttachmentName(attachment.file_url)}
                            </span>
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                    </a>
                ))}
            </div>
        </div>
    );
}
