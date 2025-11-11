package by.aresheg.restaurant.service.impl;

import by.aresheg.restaurant.domain.model.auth.RefreshToken;
import by.aresheg.restaurant.domain.model.user.User;
import by.aresheg.restaurant.repository.RefreshTokenRepository;
import by.aresheg.restaurant.security.props.JwtProperties;
import by.aresheg.restaurant.service.RefreshTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class RefreshTokenServiceImpl implements RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;

    private final JwtProperties jwtProperties;

    public void saveRefreshToken(User user, String refreshToken) {

        Instant issuedAt = Instant.now();
        Instant expiresAt = issuedAt.plus(jwtProperties.getRefresh());

        RefreshToken token = RefreshToken.builder()
                .user(user)
                .token(refreshToken)
                .issuedAt(issuedAt)
                .expiresAt(expiresAt)
                .revoked(false)
                .build();

        refreshTokenRepository.save(token);
    }

}
