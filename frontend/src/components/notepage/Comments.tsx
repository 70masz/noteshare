import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { useState, FormEvent } from "react";
import { getComments, createComment } from "../../services/commentService";
import { CommentsProps } from "../../types/props/commentsprops";
import { Link } from "react-router-dom";

export const Comments = ({ noteId }: CommentsProps) => {
    const [content, setContent] = useState('');
    const queryClient = useQueryClient();

    const { data: comments, isLoading } = useQuery({
        queryKey: ['comments', noteId],
        queryFn: () => getComments(noteId)
    });

    const mutation = useMutation({
        mutationFn: async () => {
            await createComment(noteId, { content });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['comments', noteId] });
            setContent('');
        }
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        mutation.mutate();
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
                    disabled={mutation.isPending || !content.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {mutation.isPending ? 'Posting...' : 'Post Comment'}
                </button>
            </form>

            <div className="space-y-4">
                {comments?.map(comment => (
                    <div key={comment.id} className="border-b pb-4">
                        <div className="flex justify-between items-center mb-2">
                            <Link to={`/user/${comment.username}`} className="font-medium">{comment.username}</Link>

                        </div>
                        <p className="text-gray-700">{comment.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};