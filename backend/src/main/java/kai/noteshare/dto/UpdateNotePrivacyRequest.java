package kai.noteshare.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateNotePrivacyRequest {
    @NotNull
    private Boolean isPrivate;
}
