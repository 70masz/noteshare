package kai.noteshare.services;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kai.noteshare.entities.Comment;
import kai.noteshare.entities.Note;
import kai.noteshare.entities.User;
import kai.noteshare.exceptions.UnauthorizedAccessException;
import kai.noteshare.repositories.CommentRepository;

@Service
@Transactional
public class CommentService {
    private final CommentRepository commentRepository;
    private final NoteService noteService;

    public CommentService(CommentRepository commentRepository, NoteService noteService) {
        this.commentRepository = commentRepository;
        this.noteService = noteService;
    }

    public void deleteComment(Long commentId, User currentUser) {
        Comment comment = commentRepository.findById(commentId)
            .orElseThrow(() -> new RuntimeException("Comment not found"));
            
        if (!comment.getUser().equals(currentUser)) {
            throw new UnauthorizedAccessException("Cannot delete this comment");
        }
        
        commentRepository.delete(comment);
    }

    public List<Comment> getNoteComments(Long noteId) {
        return commentRepository.findByNoteId(noteId);
    }

    public Comment createComment(Long noteId, String content, User user) {
        Note note = noteService.getNoteOrThrow(noteId);
        
        Comment comment = new Comment();
        comment.setContent(content);
        comment.setNote(note);
        comment.setUser(user);
        
        return commentRepository.save(comment);
    }
}