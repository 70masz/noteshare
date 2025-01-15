package kai.noteshare.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import kai.noteshare.config.JwtConfigProperties;
import kai.noteshare.entities.User;
import kai.noteshare.entities.UserRole;
import kai.noteshare.security.JwtService;
import kai.noteshare.services.UserService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthenticationManager authManager;
    private final JwtService jwtService;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final String cookieName;

    public AuthController(
            AuthenticationManager authManager,
            JwtService jwtService,
            UserService userService,
            PasswordEncoder passwordEncoder,
            JwtConfigProperties jwtConfig
    ) {
        this.authManager = authManager;
        this.jwtService = jwtService;
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.cookieName = jwtConfig.cookieName();
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(
            @RequestBody @Valid AuthenticationRequest request,
            HttpServletResponse response
    ) {
        authManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.username(),
                request.password()
            )
        );

        UserDetails userDetails = userService.loadUserByUsername(request.username());
        String jwt = jwtService.generateToken(userDetails);

        Cookie cookie = new Cookie(cookieName, jwt);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        response.addCookie(cookie);

        return ResponseEntity.ok(new AuthenticationResponse(
            request.username(),
            userService.getUserRole(request.username())
        ));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(
            @RequestBody @Valid RegisterRequest request,
            HttpServletResponse response
    ) {
        if (userService.userExists(request.username())) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Username already exists"
            );
        }

        User user = userService.createUser(
            request.username(),
            passwordEncoder.encode(request.password())
        );

        UserDetails userDetails = userService.loadUserByUsername(user.getUsername());
        String jwt = jwtService.generateToken(userDetails);

        Cookie cookie = new Cookie(cookieName, jwt);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        response.addCookie(cookie);

        return ResponseEntity.ok(new AuthenticationResponse(
            request.username(),
            user.getRole()
        ));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletResponse response) {
        Cookie cookie = new Cookie(cookieName, "");
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);
        
        return ResponseEntity.ok().build();
    }
}

record AuthenticationRequest(
    @NotBlank String username,
    @NotBlank String password
) {}

record RegisterRequest(
    @NotBlank String username,
    @NotBlank @Size(min = 8) String password
) {}

record AuthenticationResponse(
    String username,
    UserRole role
) {}
