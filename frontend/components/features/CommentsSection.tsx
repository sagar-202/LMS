'use client';

import React, { useState, useEffect } from 'react';
import { lmsApi, CommentNode } from '@/lib/api';
import Button from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';

interface CommentsSectionProps {
    lessonId: number;
}

export default function CommentsSection({ lessonId }: CommentsSectionProps) {
    const { isAuthenticated } = useAuthStore();
    const [comments, setComments] = useState<CommentNode[]>([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [replyingTo, setReplyingTo] = useState<number | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const fetchComments = React.useCallback(async () => {
        try {
            setLoading(true);
            const data = await lmsApi.getComments(lessonId);
            setComments(data);
        } catch (err) {
            console.error('Failed to fetch comments:', err);
        } finally {
            setLoading(false);
        }
    }, [lessonId]);

    useEffect(() => {
        if (lessonId) fetchComments();
    }, [lessonId, fetchComments]);

    const handleSubmit = async (parentId: number | null = null) => {
        const content = parentId ? (document.getElementById(`reply-${parentId}`) as HTMLTextAreaElement)?.value : newComment;
        if (!content || content.trim() === '') return;

        setSubmitting(true);
        try {
            await lmsApi.addComment(lessonId, content, parentId);
            if (!parentId) setNewComment('');
            else setReplyingTo(null);
            await fetchComments();
        } catch (err) {
            console.error('Failed to post comment:', err);
            window.alert('Failed to post comment. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const CommentItem = ({ comment, isReply = false }: { comment: CommentNode, isReply?: boolean }) => (
        <div className={`flex gap-4 ${isReply ? 'mt-4' : 'mt-8 border-b border-gray-100 dark:border-gray-800 pb-8 last:border-0'}`}>
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center text-gray-500 font-black text-xs border border-gray-100 dark:border-gray-700">
                {comment.user_name[0].toUpperCase()}
            </div>
            <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                    <span className="text-sm font-black text-gray-900 dark:text-white">{comment.user_name}</span>
                    {comment.user_role !== 'student' && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest ${
                            comment.user_role === 'admin' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'
                        }`}>
                            {comment.user_role}
                        </span>
                    )}
                    <span className="text-[10px] text-gray-400 font-bold">{new Date(comment.created_at).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                    {comment.content}
                </p>
                <div className="flex items-center gap-4 pt-1">
                    <button 
                        onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                        className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 hover:underline"
                    >
                        Reply
                    </button>
                </div>
                
                {replyingTo === comment.id && (
                    <div className="mt-4 space-y-4">
                        <textarea
                            id={`reply-${comment.id}`}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                            placeholder="Write a reply..."
                            rows={2}
                        />
                        <div className="flex gap-2">
                            <Button size="sm" onClick={() => handleSubmit(comment.id)} disabled={submitting}>Post Reply</Button>
                            <Button size="sm" variant="outline" onClick={() => setReplyingTo(null)}>Cancel</Button>
                        </div>
                    </div>
                )}

                {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-4 pl-4 border-l-2 border-gray-50 dark:border-gray-800">
                        {comment.replies.map(reply => (
                            <CommentItem key={reply.id} comment={reply} isReply />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );

    if (loading && comments.length === 0) return (
        <div className="space-y-8 animate-pulse">
            {[1, 2].map(i => (
                <div key={i} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800"></div>
                    <div className="flex-1 space-y-3">
                        <div className="h-3 w-32 bg-gray-100 dark:bg-gray-800 rounded-full"></div>
                        <div className="h-4 w-full bg-gray-100 dark:bg-gray-800 rounded-full"></div>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <section className="bg-white dark:bg-gray-900 rounded-[3rem] border border-gray-100 dark:border-gray-800 p-8 lg:p-12 shadow-2xl shadow-blue-500/5">
            <header className="mb-10 flex items-center justify-between">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Discussion</h2>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{comments.length} Comments</span>
            </header>

            {isAuthenticated ? (
                <div className="mb-12 space-y-4">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-[2rem] outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                        placeholder="Ask a question or share your thoughts..."
                        rows={3}
                    />
                    <div className="flex justify-end">
                        <Button variant="primary" onClick={() => handleSubmit()} disabled={submitting || !newComment.trim()}>
                            Post Comment
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="mb-12 p-6 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-3xl text-center">
                    <p className="text-sm font-bold text-gray-600 dark:text-gray-400">
                        Please <Button href="/auth/login" variant="ghost" className="px-1 text-blue-600 underline">Sign In</Button> to join the discussion.
                    </p>
                </div>
            )}

            <div className="space-y-2">
                {comments.length > 0 ? (
                    comments.map(comment => <CommentItem key={comment.id} comment={comment} />)
                ) : (
                    <div className="py-20 text-center border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-[3rem]">
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Be the first to start a conversation!</p>
                    </div>
                )}
            </div>
        </section>
    );
}
