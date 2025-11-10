package by.aresheg.restaurant.security;

import by.aresheg.restaurant.domain.exception.auth.InvalidTokenException;
import by.aresheg.restaurant.domain.model.role.Role;
import by.aresheg.restaurant.domain.model.auth.dto.auth.JwtResponse;
import by.aresheg.restaurant.domain.model.user.User;
import by.aresheg.restaurant.mapper.RoleMapper;
import by.aresheg.restaurant.security.props.JwtProperties;
import by.aresheg.restaurant.service.UserService;
import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.exceptions.TokenExpiredException;
import com.auth0.jwt.interfaces.DecodedJWT;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class JwtTokenProvider {

    private static final String TOKEN_TYPE_ACCESS = "access";

    private static final String TOKEN_TYPE_REFRESH = "refresh";

    private final JwtProperties jwtProperties;

    private final Algorithm jwtAlgorithm;

    private final JWTVerifier jwtVerifier;

    private final UserService userService;

    private final UserDetailsService userDetailsService;

    private final RoleMapper roleMapper;

    public String generateAccessToken(Long id, String email, Set<Role> roles) {
        Instant issuedAt = Instant.now();
        Instant expiresAt = issuedAt.plus(jwtProperties.getAccess());

        return JWT.create()
                .withJWTId(UUID.randomUUID().toString())
                .withSubject(email)
                .withClaim("userId", id)
                .withClaim("roles", resolveRoles(roles))
                .withClaim("type", TOKEN_TYPE_ACCESS)
                .withIssuer(jwtProperties.getIssuer())
                .withAudience(jwtProperties.getAudience())
                .withIssuedAt(issuedAt)
                .withExpiresAt(expiresAt)
                .sign(jwtAlgorithm);
    }

    private List<String> resolveRoles(Set<Role> roles) {
        return roles.stream()
                .map(String::valueOf)
                .toList();
    }

    public String generateRefreshToken(Long id, String email) {
        Instant issuedAt = Instant.now();
        Instant expiresAt = issuedAt.plus(jwtProperties.getRefresh());

        return JWT.create()
                .withJWTId(UUID.randomUUID().toString())
                .withSubject(email)
                .withClaim("userId", id)
                .withClaim("type", TOKEN_TYPE_REFRESH)
                .withIssuedAt(issuedAt)
                .withExpiresAt(expiresAt)
                .sign(jwtAlgorithm);
    }

    public JwtResponse refreshTokens(String refreshToken){
        DecodedJWT decodedJWT = validateToken(refreshToken);

        Long userId = decodedJWT.getClaim("userId").asLong();
        User user = userService.getUserById(userId);

        String newAccessToken = generateAccessToken(userId, user.getEmail(),user.getRoles());
        String newRefreshToken = generateRefreshToken(userId, user.getEmail());

        return JwtResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .build();
    }

    private DecodedJWT validateToken(String token) {
        try {
            return jwtVerifier.verify(token);
        } catch (TokenExpiredException ex) {
            throw new TokenExpiredException("Refresh token is expired", ex.getExpiredOn());
        } catch (JWTVerificationException ex) {
            throw new InvalidTokenException("Invalid token", ex);
        }
    }

    public Authentication authenticate(String token) {
        String username = validateToken(token).getSubject();
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
    }

}
