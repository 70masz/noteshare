import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { NoteGrid } from "../components/folderpage/NoteGrid";
import { getFolderDetails } from "../services/folderService";
import { AddNoteButton } from "../components/folderpage/AddNoteButton";

export const FolderPage = () => {
    const { id } = useParams<{ id: string }>();
    const folderId = parseInt(id!, 10);
    
    const { data: folder, isLoading, error } = useQuery({
        queryKey: ["folder", folderId],
        queryFn: () => getFolderDetails(folderId),
        enabled: !isNaN(folderId)
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading folder</div>;
    if (!folder) return null;

    return (
        <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
                <h1 className="text-2xl font-bold mb-2">{folder.name}</h1>
                <p className="text-gray-600">Created by {folder.username}</p>
                <AddNoteButton folderId={folder.id} />
            </div>
            <NoteGrid folderId={folder.id} />
        </div>
    );
};