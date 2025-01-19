import { Link } from "react-router-dom";
import { FolderGridProps } from "../../types/props/foldergridprops";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useAuthContext } from "../../hooks/auth/useAuthContext";
import { api } from "../../services/api";

export const FolderGrid = ({ folders }: FolderGridProps) => {
    const { user } = useAuthContext();
    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: async (folderId: number) => {
            await api.delete(`/folders/${folderId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profile', user?.username] });
        }
    });

    const handleDelete = (folderId: number, event: React.MouseEvent) => {
        event.preventDefault();
        if (confirm('Are you sure you want to delete this folder?')) {
            deleteMutation.mutate(folderId);
        }
    };

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Folders</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {folders.map(folder => (
                    <Link to={`/folder/${folder.id}`} key={folder.id} className="relative border rounded p-4 hover:shadow-md transition group">
                        <h3 className="font-medium">{folder.name}</h3>
                        {folder.username === user?.username && (
                            <button
                                onClick={(e) => handleDelete(folder.id, e)}
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-red-500"
                                aria-label="Delete folder"
                            >
                                ×
                            </button>
                        )}
                    </Link>
                ))}
            </div>
            {folders.length === 0 && (
                <p className="text-gray-500 text-center">No folders found</p>
            )}
        </div>
    );
};