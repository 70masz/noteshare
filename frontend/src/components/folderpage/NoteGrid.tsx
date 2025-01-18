import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { NoteGridProps } from "../../types/props/notegridprops";
import { getFolderNotes } from "../../services/folderService";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../hooks/auth/useAuthContext";
import { api } from "../../services/api";

export const NoteGrid = ({ folderId }: NoteGridProps) => {
    const { user } = useAuthContext();
    const queryClient = useQueryClient();

    const { data: notes, isLoading, error } = useQuery({
        queryKey: ["notes", folderId],
        queryFn: () => getFolderNotes(folderId)
    });

    const deleteMutation = useMutation({
        mutationFn: async (noteId: number) => {
            await api.delete(`/notes/${noteId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notes", folderId] });
        }
    });

    const handleDelete = (noteId: number, event: React.MouseEvent) => {
        event.preventDefault();
        if (confirm('Are you sure you want to delete this note?')) {
            deleteMutation.mutate(noteId);
        }
    };

    if (isLoading) return <div>Loading notes...</div>;
    if (error) return <div>Error loading notes</div>;
    if (!notes) return null;

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Notes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {notes.map(note => (
                    <Link to={`/note/${note.id}`} key={note.id} className="relative border rounded p-4 hover:shadow-md transition group">
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">Note #{note.id}</span>
                            {note.isPrivate && (
                                <span className="text-sm text-gray-500">Private</span>
                            )}
                        </div>
                        <p className="text-sm text-gray-600">By {note.username}</p>
                        {note.username === user?.username && (
                            <button
                                onClick={(e) => handleDelete(note.id, e)}
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-red-500"
                                aria-label="Delete note"
                            >
                                ×
                            </button>
                        )}
                    </Link>
                ))}
            </div>
            {notes.length === 0 && (
                <p className="text-gray-500 text-center">No notes found</p>
            )}
        </div>
    );
};