package kai.noteshare.security;

import java.time.Instant;
import java.util.Date;
import java.util.Optional;

import javax.crypto.SecretKey;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import kai.noteshare.config.JwtConfigProperties;

@Service
public class JwtService {
    private final SecretKey key;
    private final long expirationMs;
    private final String cookieName;

    public JwtService(JwtConfigProperties props) {
        this.key = Jwts.SIG.HS512.key().build();
        this.expirationMs = props.expirationMs();
        this.cookieName = props.cookieName();
    }

    public String generateToken(UserDetails userDetails) {
        Date now = new Date();
        Date expirateDate = new Date(now.getTime() + expirationMs);
        return Jwts.builder()
            .subject(userDetails.getUsername())
            .issuedAt(now)
            .expiration(expirateDate)
            .signWith(key)
            .compact();
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        String username = extractUsername(token);
        return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    public String extractUsername(String token) {
        return extractClaims(token).getSubject();
    }

    private boolean isTokenExpired(String token) {
        return extractClaims(token)
            .getExpiration()
            .toInstant()
            .isBefore(Instant.now());
    }

    private Claims extractClaims(String token) {
        return Jwts.parser()
            .verifyWith(key)
            .build()
            .parseSignedClaims(token)
            .getPayload();
    }

    public Optional<String> getTokenFromCookie(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) return Optional.empty();
        
        return Optional.ofNullable(cookies)
            .flatMap(cookieArray -> 
                java.util.Arrays.stream(cookieArray)
                    .filter(cookie -> cookieName.equals(cookie.getName()))
                    .map(Cookie::getValue)
                    .findFirst()
            );
    }
}