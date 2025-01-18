package kai.noteshare.controllers;

import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import kai.noteshare.dto.CreateFolderRequest;
import kai.noteshare.dto.FolderResponse;
import kai.noteshare.dto.UpdateFolderRequest;
import kai.noteshare.entities.Folder;
import kai.noteshare.entities.User;
import kai.noteshare.exceptions.UnauthorizedAccessException;
import kai.noteshare.services.FolderService;
import kai.noteshare.services.UserService;

@RestController
@RequestMapping("/api/folders")
public class FolderController {
    private final FolderService folderService;
    private final UserService userService;

    public FolderController(FolderService folderService, UserService userService) {
        this.folderService = folderService;
        this.userService = userService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<FolderResponse> getFolder(
        @PathVariable Long id, Principal principal) {
            User user = userService.getUserByUsername(principal.getName());
            Folder folder = folderService.getFolderOrThrow(id);
            
            if (!folder.getUser().equals(user)) {
                throw new UnauthorizedAccessException("No access to this folder");
            }
        
        return ResponseEntity.ok(toFolderResponse(folder));
    }

    @PostMapping
    public ResponseEntity<FolderResponse> createFolder(
            @Valid @RequestBody CreateFolderRequest request,
            Principal principal) {
        User user = userService.getUserByUsername(principal.getName());
        Folder folder = folderService.createFolder(request.getName(), user);
        return ResponseEntity.ok(toFolderResponse(folder));
    }

    @GetMapping
    public ResponseEntity<List<FolderResponse>> getUserFolders(Principal principal) {
        User user = userService.getUserByUsername(principal.getName());
        return ResponseEntity.ok(folderService.getUserFolders(user).stream()
            .map(this::toFolderResponse)
            .collect(Collectors.toList()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFolder(
            @PathVariable Long id,
            Principal principal) {
        User user = userService.getUserByUsername(principal.getName());
        folderService.deleteFolder(id, user);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<FolderResponse> updateFolder(
            @PathVariable Long id,
            @Valid @RequestBody UpdateFolderRequest request,
            Principal principal) {
        User user = userService.getUserByUsername(principal.getName());
        Folder folder = folderService.updateFolder(id, request.getName(), user);
        return ResponseEntity.ok(toFolderResponse(folder));
    }

    private FolderResponse toFolderResponse(Folder folder) {
        FolderResponse response = new FolderResponse();
        response.setId(folder.getId());
        response.setName(folder.getName());
        response.setUsername(folder.getUser().getUsername());
        return response;
    }
}