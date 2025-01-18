import { useQuery } from "@tanstack/react-query";
import { NoteGridProps } from "../../types/props/notegridprops";
import { getFolderNotes } from "../../services/folderService";

export const NoteGrid = ({ folderId }: NoteGridProps) => {
    const { data: notes, isLoading, error } = useQuery({
        queryKey: ["notes", folderId],
        queryFn: () => getFolderNotes(folderId)
    });

    if (isLoading) return <div>Loading notes...</div>;
    if (error) return <div>Error loading notes</div>;
    if (!notes) return null;

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Notes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {notes.map(note => (
                    <div key={note.id} className="border rounded p-4 hover:shadow-md transition">
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">Note #{note.id}</span>
                            {note.isPrivate && (
                                <span className="text-sm text-gray-500">Private</span>
                            )}
                        </div>
                        <p className="text-sm text-gray-600">By {note.username}</p>
                    </div>
                ))}
            </div>
            {notes.length === 0 && (
                <p className="text-gray-500 text-center">No notes found</p>
            )}
        </div>
    );
};