package kai.noteshare.services;

import java.time.LocalDateTime;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import kai.noteshare.entities.UserRole;
import kai.noteshare.repositories.UserRepository;

@Service
@Transactional
public class UserService implements UserDetailsService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        kai.noteshare.entities.User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return org.springframework.security.core.userdetails.User
            .withUsername(user.getUsername())
            .password(user.getPassword())
            .authorities("ROLE_" + user.getRole())
            .build();
    }

    public boolean userExists(String username) {
        return userRepository.existsByUsername(username);
    }

    public kai.noteshare.entities.User createUser(String username, String encodedPassword) {
        kai.noteshare.entities.User user = new kai.noteshare.entities.User();
        user.setUsername(username);
        user.setPassword(encodedPassword);
        user.setRole(UserRole.USER);
        user.setCreatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    public UserRole getUserRole(String username) {
        return userRepository.findByUsername(username)
            .map(kai.noteshare.entities.User::getRole)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }
}