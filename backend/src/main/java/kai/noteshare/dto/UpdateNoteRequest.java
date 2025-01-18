package kai.noteshare.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateNoteRequest {
    @NotBlank
    private String content;
}
