import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import { useParams } from "react-router-dom";
import { getNoteContent, getNoteDetails, updateNoteContent, updateNotePrivacy } from "../services/noteService";
import { Editor } from "@monaco-editor/react";
import { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/auth/useAuthContext";
import { Comments } from "../components/notepage/Comments";
import { Note } from "../types/note";

export const NotePage = () => {
    const { id } = useParams<{ id: string }>();
    const noteId = parseInt(id!, 10);
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);
    const { user } = useAuthContext();
    const queryClient = useQueryClient();
    
    const { data: note } = useQuery<Note>({
        queryKey: ["note", noteId],
        queryFn: () => getNoteDetails(noteId)
    });

    useEffect(() => {
        if (note) {
            setIsPrivate(note.isPrivate);
        }
    }, [note]);

    const { data: content, isLoading, error } = useQuery<string>({
        queryKey: ["note-content", noteId],
        queryFn: async () => {
            const content = await getNoteContent(noteId);
            setEditContent(content);
            return content;
        },
        enabled: !isNaN(noteId)
    });

    const contentMutation = useMutation({
        mutationFn: async () => {
            await updateNoteContent(noteId, editContent);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["note-content", noteId] });
            setIsEditing(false);
        }
    });

    const privacyMutation = useMutation({
        mutationFn: async () => {
            await updateNotePrivacy(noteId, isPrivate);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["note", noteId] });
        }
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading note content</div>;
    if (!content || !note) return null;

    const handleSave = () => {
        contentMutation.mutate();
    };

    const handlePrivacyChange = (newPrivate: boolean) => {
        setIsPrivate(newPrivate);
        privacyMutation.mutate();
    };

    return (
        <div>
            <div className="bg-white shadow rounded-lg p-6">
                <div className="mb-4 pb-4 border-b flex justify-between items-center">
                    <div>
                        <span className="text-sm text-gray-600">Created by {note.username}</span>
                        {note.username === user?.username && (
                            <div className="mt-2 flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="isPrivate"
                                    checked={isPrivate}
                                    onChange={(e) => handlePrivacyChange(e.target.checked)}
                                    className="h-4 w-4 text-blue-600"
                                />
                                <label htmlFor="isPrivate" className="text-sm text-gray-600">
                                    Private note
                                </label>
                            </div>
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
                                disabled={contentMutation.isPending}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                            >
                                {contentMutation.isPending ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </div>
                ) : (
                    <article className="prose prose-slate lg:prose-lg mx-auto">
                        <ReactMarkdown>{content}</ReactMarkdown>
                    </article>
                )}
            </div>
            <div className="mt-6 bg-white shadow rounded-lg p-6">
                <Comments noteId={noteId} />
            </div>
        </div>
    );
};