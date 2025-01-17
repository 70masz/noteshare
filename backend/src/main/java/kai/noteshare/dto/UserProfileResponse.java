package kai.noteshare.dto;

import java.time.LocalDateTime;
import java.util.List;

import lombok.Data;

@Data
public class UserProfileResponse {
    private String username;
    private LocalDateTime createdAt;
    private List<FolderResponse> folders;
    private int totalNotes;
}
