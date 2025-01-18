package kai.noteshare.dto;

import lombok.Data;

@Data
public class NoteResponse {
    private Long id;
    private Boolean isPrivate;
    private String username;
    private Long folderId;
}
