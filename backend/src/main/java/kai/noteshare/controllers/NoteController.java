package kai.noteshare.controllers;

import java.io.IOException;
import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import kai.noteshare.dto.CreateNoteRequest;
import kai.noteshare.dto.NoteResponse;
import kai.noteshare.dto.UpdateNoteRequest;
import kai.noteshare.entities.Note;
import kai.noteshare.entities.User;
import kai.noteshare.services.NoteService;
import kai.noteshare.services.UserService;

@RestController
@RequestMapping("/api")
public class NoteController {
    private final NoteService noteService;
    private final UserService userService;

    public NoteController(NoteService noteService, UserService userService) {
        this.noteService = noteService;
        this.userService = userService;
    }

    @GetMapping("/notes/public/latest")
    public ResponseEntity<List<NoteResponse>> getLatestPublicNotes() {
        return ResponseEntity.ok(noteService.getLatestPublicNotes().stream()
            .map(this::toNoteResponse)
            .collect(Collectors.toList()));
    }

    @PostMapping("/notes")
    public ResponseEntity<NoteResponse> createNote(
            @Valid @RequestBody CreateNoteRequest request,
            Principal principal) throws IOException {
        User user = userService.getUserByUsername(principal.getName());
        Note note = noteService.createNote(request.getContent(), request.getIsPrivate(), user, request.getFolderId());
        return ResponseEntity.ok(toNoteResponse(note));
    }

    @GetMapping("/notes/{id}/content")
    public ResponseEntity<String> getNoteContent(
            @PathVariable Long id,
            Principal principal) throws IOException {
        User user = userService.getUserByUsername(principal.getName());
        String content = noteService.getNoteContent(id, user);
        return ResponseEntity.ok(content);
    }

    @PutMapping("/notes/{id}/content")
    public ResponseEntity<Void> updateNoteContent(
            @PathVariable Long id,
            @Valid @RequestBody UpdateNoteRequest request,
            Principal principal) throws IOException {
        User user = userService.getUserByUsername(principal.getName());
        noteService.updateNoteContent(id, request.getContent(), user);
        return ResponseEntity.ok().build();
    }
    @GetMapping("/notes/{id}")
    public ResponseEntity<NoteResponse> getNote(
            @PathVariable Long id,
            Principal principal) {
        Note note = noteService.getNoteOrThrow(id);
        return ResponseEntity.ok(toNoteResponse(note));
    }

    @DeleteMapping("/notes/{id}")
    public ResponseEntity<Void> deleteNote(
            @PathVariable Long id,
            Principal principal) throws IOException {
        User user = userService.getUserByUsername(principal.getName());
        noteService.deleteNote(id, user);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/folders/{folderId}/notes")
    public ResponseEntity<List<NoteResponse>> getFolderNotes(
            @PathVariable Long folderId,
            Principal principal) {
        User user = userService.getUserByUsername(principal.getName());
        return ResponseEntity.ok(noteService.getFolderNotes(folderId, user).stream()
            .map(this::toNoteResponse)
            .collect(Collectors.toList()));
    }

    private NoteResponse toNoteResponse(Note note) {
        NoteResponse response = new NoteResponse();
        response.setId(note.getId());
        response.setIsPrivate(note.getIsPrivate());
        response.setUsername(note.getUser().getUsername());
        response.setFolderId(note.getFolder().getId());
        return response;
    }
}