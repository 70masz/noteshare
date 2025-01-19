package kai.noteshare.controllers;

import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import kai.noteshare.dto.CommentRequest;
import kai.noteshare.dto.CommentResponse;
import kai.noteshare.entities.Comment;
import kai.noteshare.services.CommentService;
import kai.noteshare.services.UserService;

@RestController
@RequestMapping("/api/notes/{noteId}/comments")
public class CommentController {
    private final CommentService commentService;
    private final UserService userService;

    public CommentController(CommentService commentService, UserService userService) {
        this.commentService = commentService;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<CommentResponse>> getComments(@PathVariable Long noteId) {
        return ResponseEntity.ok(commentService.getNoteComments(noteId).stream()
            .map(this::toCommentResponse)
            .collect(Collectors.toList()));
    }

    @PostMapping
    public ResponseEntity<CommentResponse> createComment(
            @PathVariable Long noteId,
            @Valid @RequestBody CommentRequest request,
            Principal principal) {
        Comment comment = commentService.createComment(
            noteId,
            request.getContent(),
            userService.getUserByUsername(principal.getName())
        );
        return ResponseEntity.ok(toCommentResponse(comment));
    }

    private CommentResponse toCommentResponse(Comment comment) {
        CommentResponse response = new CommentResponse();
        response.setId(comment.getId());
        response.setContent(comment.getContent());
        response.setUsername(comment.getUser().getUsername());
        return response;
    }
}