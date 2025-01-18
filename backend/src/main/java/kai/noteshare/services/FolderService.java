package kai.noteshare.services;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kai.noteshare.entities.Folder;
import kai.noteshare.entities.User;
import kai.noteshare.exceptions.FolderNotFoundException;
import kai.noteshare.exceptions.UnauthorizedAccessException;
import kai.noteshare.repositories.FolderRepository;

@Service
@Transactional
public class FolderService {
    private final FolderRepository folderRepository;

    public FolderService(FolderRepository folderRepository) {
        this.folderRepository = folderRepository;
    }

    public Folder createFolder(String name, User user) {
        Folder folder = new Folder();
        folder.setName(name);
        folder.setUser(user);
        return folderRepository.save(folder);
    }

    public List<Folder> getUserFolders(User user) {
        return folderRepository.findByUser(user);
    }

    public void deleteFolder(Long folderId, User currentUser) {
        Folder folder = getFolderOrThrow(folderId);
        checkAccess(folder, currentUser);
        folderRepository.delete(folder);
    }

    public Folder updateFolder(Long folderId, String name, User currentUser) {
        Folder folder = getFolderOrThrow(folderId);
        checkAccess(folder, currentUser);
        folder.setName(name);
        return folderRepository.save(folder);
    }

    public Folder getFolderOrThrow(Long folderId) {
        return folderRepository.findById(folderId)
            .orElseThrow(() -> new FolderNotFoundException("Folder not found"));
    }

    private void checkAccess(Folder folder, User user) {
        if (!folder.getUser().equals(user)) {
            throw new UnauthorizedAccessException("No access to this folder");
        }
    }
}
