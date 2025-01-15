package kai.noteshare.config;

import org.springframework.stereotype.Component;

import jakarta.servlet.http.Cookie;

@Component
public class CookieConfig {
    private final String cookieName;

    public CookieConfig(JwtConfigProperties jwtConfig) {
        this.cookieName = jwtConfig.cookieName();
    }

    public Cookie createJwtCookie(String token) {
        Cookie cookie = new Cookie(cookieName, token);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        return cookie;
    }

    public Cookie createLogoutCookie() {
        Cookie cookie = new Cookie(cookieName, "");
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        return cookie;
    }
}
