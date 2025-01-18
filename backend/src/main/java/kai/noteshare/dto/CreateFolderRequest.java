package kai.noteshare.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateFolderRequest {
    @NotBlank
    private String name;
}
