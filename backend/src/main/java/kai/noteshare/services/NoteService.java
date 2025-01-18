package kai.noteshare.services;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kai.noteshare.entities.Folder;
import kai.noteshare.entities.Note;
import kai.noteshare.entities.User;
import kai.noteshare.exceptions.NoteNotFoundException;
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
            throw new RuntimeException("Could not initialize note storage", e);
        }
    }

    public Note createNote(String content, boolean isPrivate, User user, Long folderId) throws IOException {
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
    }

    public String getNoteContent(Long noteId, User currentUser) throws IOException {
        Note note = getNoteOrThrow(noteId);
        checkReadAccess(note, currentUser);
        return Files.readString(noteStoragePath.resolve(note.getFilePath()));
    }

    public void updateNoteContent(Long noteId, String content, User currentUser) throws IOException {
        Note note = getNoteOrThrow(noteId);
        checkWriteAccess(note, currentUser);
        Files.write(noteStoragePath.resolve(note.getFilePath()), content.getBytes());
    }

    public void deleteNote(Long noteId, User currentUser) throws IOException {
        Note note = getNoteOrThrow(noteId);
        checkWriteAccess(note, currentUser);
        Files.deleteIfExists(noteStoragePath.resolve(note.getFilePath()));
        noteRepository.delete(note);
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