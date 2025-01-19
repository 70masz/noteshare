import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { useState, FormEvent } from "react";
import { getComments, createComment, deleteComment } from "../../services/commentService";
import { CommentsProps } from "../../types/props/commentsprops";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../hooks/auth/useAuthContext";

export const Comments = ({ noteId }: CommentsProps) => {
    const [content, setContent] = useState("");
    const { user } = useAuthContext();
    const queryClient = useQueryClient();

    const { data: comments, isLoading } = useQuery({
        queryKey: ['comments', noteId],
        queryFn: () => getComments(noteId)
    });

    const createMutation = useMutation({
        mutationFn: async () => {
            await createComment(noteId, { content });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['comments', noteId] });
            setContent('');
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (commentId: number) => {
            await deleteComment(noteId, commentId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['comments', noteId] });
        }
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        createMutation.mutate();
    };

    const handleDelete = (commentId: number) => {
        if (confirm('Are you sure you want to delete this comment?')) {
            deleteMutation.mutate(commentId);
        }
    };

    if (isLoading) return <div>Loading comments...</div>;

    return (
        <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Comments</h3>
            
            <form onSubmit={handleSubmit} className="mb-6">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full p-2 border rounded mb-2"
                    rows={3}
                    placeholder="Write a comment..."
                />
                <button
                    type="submit"
                    disabled={createMutation.isPending || !content.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {createMutation.isPending ? 'Posting...' : 'Post Comment'}
                </button>
            </form>

            <div className="space-y-4">
                {comments?.map(comment => (
                    <div key={comment.id} className="relative border-b pb-4">
                        <div className="flex justify-between items-center mb-2">
                            <Link to={`/user/${comment.username}`} className="font-medium">
                                {comment.username}
                            </Link>
                            {user?.username === comment.username && (
                                <button
                                    onClick={() => handleDelete(comment.id)}
                                    className="text-gray-500 hover:text-red-500"
                                    aria-label="Delete comment"
                                >
                                    ×
                                </button>
                            )}
                        </div>
                        <p className="text-gray-700">{comment.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};