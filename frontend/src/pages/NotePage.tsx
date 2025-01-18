import { useQuery } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import { useParams } from "react-router-dom";
import { getNoteContent, getNoteDetails } from "../services/noteService";

export const NotePage = () => {
    const { id } = useParams<{ id: string }>();
    const noteId = parseInt(id!, 10);
    
    const { data: note } = useQuery({
        queryKey: ["note", noteId],
        queryFn: () => getNoteDetails(noteId),
        enabled: !isNaN(noteId)
    });

    const { data: content, isLoading, error } = useQuery({
        queryKey: ["note-content", noteId],
        queryFn: () => getNoteContent(noteId),
        enabled: !isNaN(noteId)
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading note content</div>;
    if (!content || !note) return null;

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <div className="mb-4 pb-4 border-b">
                <span className="text-sm text-gray-600">Created by {note.username}</span>
                {note.isPrivate && (
                    <span className="ml-2 px-2 py-1 text-xs bg-gray-100 rounded">Private</span>
                )}
            </div>
            <article className="prose prose-slate lg:prose-lg mx-auto">
                <ReactMarkdown>{content}</ReactMarkdown>
            </article>
        </div>
    );
};