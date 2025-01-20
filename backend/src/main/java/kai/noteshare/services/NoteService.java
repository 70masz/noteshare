package kai.noteshare.services;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kai.noteshare.entities.Folder;
import kai.noteshare.entities.Note;
import kai.noteshare.entities.User;
import kai.noteshare.exceptions.InvalidRequestException;
import kai.noteshare.exceptions.NoteNotFoundException;
import kai.noteshare.exceptions.StorageException;
import kai.noteshare.exceptions.UnauthorizedAccessException;
import kai.noteshare.repositories.NoteRepository;

@Service
@Transactional
public class NoteService {
    @Autowired
    private FolderService folderService;


    private final NoteRepository noteRepository;
    private final Path noteStoragePath = Paths.get("notes");

    public NoteService(NoteRepository noteRepository) {
        this.noteRepository = noteRepository;
        initializeStorage();
    }

    private void initializeStorage() {
        try {
            Files.createDirectories(noteStoragePath);
        } catch (IOException e) {
            throw new StorageException("Could not initialize note storage", e);
        }
    }

    public void updateNotePrivacy(Long noteId, boolean isPrivate, User currentUser) {
        Note note = getNoteOrThrow(noteId);
        checkWriteAccess(note, currentUser);
        note.setIsPrivate(isPrivate);
        noteRepository.save(note);
    }

    public List<Note> getLatestPublicNotes() {
        return noteRepository.findByIsPrivateFalseOrderByIdDesc(
            PageRequest.of(0, 10)
        );
    }

    public Note createNote(String content, boolean isPrivate, User user, Long folderId) {
        if (content == null || content.trim().isEmpty()) {
            throw new InvalidRequestException("Note content cannot be empty");
        }

        try {
            String fileName = generateFileName();
            Path filePath = noteStoragePath.resolve(fileName);
            Files.write(filePath, content.getBytes());

            Folder folder = folderService.getFolderOrThrow(folderId);
            
            Note note = new Note();
            note.setFilePath(fileName);
            note.setIsPrivate(isPrivate);
            note.setUser(user);
            note.setFolder(folder);
            
            return noteRepository.save(note);
        } catch (IOException e) {
            throw new StorageException("Failed to store note content", e);
        }
    }

    public String getNoteContent(Long noteId, User currentUser) {
        Note note = getNoteOrThrow(noteId);
        checkReadAccess(note, currentUser);
        try {
            return Files.readString(noteStoragePath.resolve(note.getFilePath()));
        } catch (IOException e) {
            throw new StorageException("Failed to read note content", e);
        }
    }

    public void updateNoteContent(Long noteId, String content, User currentUser) {
        if (content == null || content.trim().isEmpty()) {
            throw new InvalidRequestException("Note content cannot be empty");
        }

        Note note = getNoteOrThrow(noteId);
        checkWriteAccess(note, currentUser);
        try {
            Files.write(noteStoragePath.resolve(note.getFilePath()), content.getBytes());
        } catch (IOException e) {
            throw new StorageException("Failed to update note content", e);
        }
    }

    public void deleteNote(Long noteId, User currentUser) {
        Note note = getNoteOrThrow(noteId);
        checkWriteAccess(note, currentUser);
        try {
            Files.deleteIfExists(noteStoragePath.resolve(note.getFilePath()));
            noteRepository.delete(note);
        } catch (IOException e) {
            throw new StorageException("Failed to delete note file", e);
        }
    }

    public List<Note> getFolderNotes(Long folderId, User currentUser) {
        return noteRepository.findByFolderIdAndUserOrIsPrivateFalse(folderId, currentUser);
    }

    public Note getNoteOrThrow(Long noteId) {
        return noteRepository.findById(noteId)
            .orElseThrow(() -> new NoteNotFoundException("Note not found"));
    }

    private void checkReadAccess(Note note, User user) {
        if (note.getIsPrivate() && !note.getUser().equals(user)) {
            throw new UnauthorizedAccessException("No access to this note");
        }
    }

    private void checkWriteAccess(Note note, User user) {
        if (!note.getUser().equals(user)) {
            throw new UnauthorizedAccessException("Cannot modify this note");
        }
    }

    private String generateFileName() {
        return System.currentTimeMillis() + ".md";
    }
}