package kai.noteshare.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateNoteRequest {
    @NotBlank
    private String content;
    
    @NotNull
    private Boolean isPrivate;
    
    @NotNull
    private Long folderId;
}
