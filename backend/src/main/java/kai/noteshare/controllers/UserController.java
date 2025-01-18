package kai.noteshare.controllers;

import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kai.noteshare.dto.FolderResponse;
import kai.noteshare.dto.UserProfileResponse;
import kai.noteshare.entities.User;
import kai.noteshare.services.FolderService;
import kai.noteshare.services.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;
    private final FolderService folderService;

    public UserController(UserService userService, FolderService folderService) {
        this.userService = userService;
        this.folderService = folderService;
    }

    @GetMapping("/{username}/profile")
    public ResponseEntity<UserProfileResponse> getUserProfile(@PathVariable String username) {
        User user = userService.getUserByUsername(username);
        
        UserProfileResponse response = new UserProfileResponse();
        response.setUsername(user.getUsername());
        response.setCreatedAt(user.getCreatedAt());
        response.setFolders(folderService.getUserFolders(user).stream()
            .map(folder -> {
                FolderResponse folderResponse = new FolderResponse();
                folderResponse.setId(folder.getId());
                folderResponse.setName(folder.getName());
                folderResponse.setUsername(folder.getUser().getUsername());
                return folderResponse;
            })
            .collect(Collectors.toList()));
        response.setTotalNotes(user.getNotes().size());
        
        return ResponseEntity.ok(response);
    }
}
