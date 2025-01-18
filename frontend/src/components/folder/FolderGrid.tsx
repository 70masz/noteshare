import { FolderGridProps } from "../../types/props/foldergridprops";

export const FolderGrid = ({ folders }: FolderGridProps) => {
    return (
        <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Folders</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {folders.map(folder => (
                    <div key={folder.id} className="border rounded p-4 hover:shadow-md transition">
                        <h3 className="font-medium">{folder.name}</h3>
                    </div>
                ))}
            </div>
            {folders.length === 0 && (
                <p className="text-gray-500 text-center">No folders found</p>
            )}
        </div>
    );
};