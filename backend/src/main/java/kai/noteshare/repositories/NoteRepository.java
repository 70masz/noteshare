package kai.noteshare.repositories;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import kai.noteshare.entities.Note;
import kai.noteshare.entities.User;

@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {
    List<Note> findByFolderIdAndUserOrIsPrivateFalse(Long folderId, User user);
    List<Note> findByIsPrivateFalseOrderByIdDesc(Pageable pageable);
}
