import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "../../services/api";
import { AddFolderButtonProps } from "../../types/props/addfolderbuttonprops";
import { useAuthContext } from "../../hooks/auth/useAuthContext";

export const AddFolderButton = ({ username }: AddFolderButtonProps) => {
    const [showModal, setShowModal] = useState(false);
    const [folderName, setFolderName] = useState('');
    const queryClient = useQueryClient();

    const currentUser = useAuthContext().user?.username;

    const mutation = useMutation({
        mutationFn: async (name: string) => {
            await api.post('/folders', { name });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profile', username] });
            setShowModal(false);
            setFolderName('');
        }
    });

    if (username !== currentUser) {
        return null;
    }

    return (
        <div className="mt-6">
            <button
                onClick={() => setShowModal(true)}
                className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
                Add Folder
            </button>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-xl">
                        <h2 className="text-xl font-bold mb-4">Create New Folder</h2>
                        <input
                            type="text"
                            value={folderName}
                            onChange={(e) => setFolderName(e.target.value)}
                            className="w-full p-2 border rounded mb-4"
                            placeholder="Folder name"
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => mutation.mutate(folderName)}
                                disabled={mutation.isPending || !folderName.trim()}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                                >
                                {mutation.isPending ? 'Creating...' : 'Create'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};