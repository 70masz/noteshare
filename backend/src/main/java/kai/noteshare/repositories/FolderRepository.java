package kai.noteshare.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import kai.noteshare.entities.Folder;
import kai.noteshare.entities.User;

@Repository
public interface FolderRepository extends JpaRepository<Folder, Long> {
    List<Folder> findByUser(User user);
}
