import { Editor } from "@monaco-editor/react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "../../services/api";
import { AddNoteButtonProps } from "../../types/props/addnotebuttonprops";

export const AddNoteButton = ({ folderId }: AddNoteButtonProps) => {
    const [showModal, setShowModal] = useState(false);
    const [content, setContent] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async () => {
            await api.post('/notes', { 
                content,
                isPrivate,
                folderId 
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notes', folderId] });
            setShowModal(false);
            setContent("");
            setIsPrivate(false);
        }
    });

    return (
        <div className="mt-6">
            <button
                onClick={() => setShowModal(true)}
                className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
                Add Note
            </button>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-4/5 max-w-4xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">Create New Note</h2>
                        <div className="h-96 border rounded mb-4">
                            <Editor
                                height="100%"
                                defaultLanguage="markdown"
                                value={content}
                                onChange={(value) => setContent(value ?? "")}
                                options={{
                                    minimap: { enabled: false }
                                }}
                            />
                        </div>
                        <div className="flex items-center mb-4">
                            <input
                                type="checkbox"
                                id="isPrivate"
                                checked={isPrivate}
                                onChange={(e) => setIsPrivate(e.target.checked)}
                                className="mr-2"
                            />
                            <label htmlFor="isPrivate">Private note</label>
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => mutation.mutate()}
                                disabled={mutation.isPending || !content.trim()}
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