package kai.noteshare.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateFolderRequest {
    @NotBlank
    private String name;
}
