import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import { useParams } from "react-router-dom";
import { getNoteContent, getNoteDetails, updateNoteContent } from "../services/noteService";
import { Editor } from "@monaco-editor/react";
import { useState } from "react";
import { useAuthContext } from "../hooks/auth/useAuthContext";

export const NotePage = () => {
    const { id } = useParams<{ id: string }>();
    const noteId = parseInt(id!, 10);
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState("");
    const { user } = useAuthContext();
    const queryClient = useQueryClient();
    
    const { data: note } = useQuery({
        queryKey: ["note", noteId],
        queryFn: () => getNoteDetails(noteId),
        enabled: !isNaN(noteId)
    });

    const { data: content, isLoading, error } = useQuery({
        queryKey: ["note-content", noteId],
        queryFn: async () => {
            const content = await getNoteContent(noteId);
            setEditContent(content);
            return content;
        },
        enabled: !isNaN(noteId)
    });

    const mutation = useMutation({
        mutationFn: async () => {
            await updateNoteContent(noteId, editContent);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["note-content", noteId] });
            setIsEditing(false);
        }
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading note content</div>;
    if (!content || !note) return null;

    const handleSave = () => {
        mutation.mutate();
    };

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <div className="mb-4 pb-4 border-b flex justify-between items-center">
                <div>
                    <span className="text-sm text-gray-600">Created by {note.username}</span>
                    {note.isPrivate && (
                        <span className="ml-2 px-2 py-1 text-xs bg-gray-100 rounded">Private</span>
                    )}
                </div>
                {user?.username === note.username && !isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Edit
                    </button>
                )}
            </div>
            {isEditing ? (
                <div className="space-y-4">
                    <div className="h-96 border rounded">
                        <Editor
                            height="100%"
                            defaultLanguage="markdown"
                            value={editContent}
                            onChange={(value) => setEditContent(value ?? "")}
                            options={{
                                minimap: { enabled: false }
                            }}
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() => setIsEditing(false)}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={mutation.isPending}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                        >
                            {mutation.isPending ? "Saving..." : "Save"}
                        </button>
                    </div>
                </div>
            ) : (
                <article className="prose prose-slate lg:prose-lg mx-auto">
                    <ReactMarkdown>{content}</ReactMarkdown>
                </article>
            )}
        </div>
    );
};