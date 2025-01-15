package kai.noteshare.dto;

import kai.noteshare.entities.UserRole;

public class AuthenticationResponse {
    private String username;
    private UserRole role;

    public AuthenticationResponse(String username, UserRole role) {
        this.username = username;
        this.role = role;
    }

    // Getters and Setters
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }
}
