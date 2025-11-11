package by.aresheg.restaurant.service.impl;

import by.aresheg.restaurant.domain.exception.auth.VerificationException;
import by.aresheg.restaurant.domain.model.auth.RefreshToken;
import by.aresheg.restaurant.domain.model.auth.dto.auth.JwtResponse;
import by.aresheg.restaurant.domain.model.user.User;
import by.aresheg.restaurant.domain.model.user.UserStatus;
import by.aresheg.restaurant.domain.model.verification.VerificationToken;
import by.aresheg.restaurant.repository.RefreshTokenRepository;
import by.aresheg.restaurant.repository.UserRepository;
import by.aresheg.restaurant.repository.VerificationTokenRepository;
import by.aresheg.restaurant.security.JwtTokenProvider;
import by.aresheg.restaurant.security.props.JwtProperties;
import by.aresheg.restaurant.service.RefreshTokenService;
import by.aresheg.restaurant.service.VerificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

import static by.aresheg.restaurant.domain.model.user.UserStatus.*;

@Service
@RequiredArgsConstructor
public class VerificationServiceImpl implements VerificationService {

    private final VerificationTokenRepository verificationTokenRepository;

    private final UserRepository userRepository;

    private final RefreshTokenService refreshTokenService;

    private final JwtTokenProvider jwtTokenProvider;

    @Transactional
    @Override
    public JwtResponse verifyEmail(String token) {
        VerificationToken verificationToken = verificationTokenRepository.findByToken(token)
                .orElseThrow(() -> new VerificationException("Invalid verification token"));

        if (verificationToken.getExpiresAt().isBefore(Instant.now()))
            throw new VerificationException("Verification token has expired");

        User user = verificationToken.getUser();

        if (user.getStatus() == UserStatus.ACTIVE)
            throw new VerificationException("User already verified");

        user.setStatus(ACTIVE);
        userRepository.save(user);
        verificationTokenRepository.delete(verificationToken);

        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getId(), user.getEmail());
        refreshTokenService.saveRefreshToken(user, refreshToken);

        return JwtResponse.builder()
                .accessToken(jwtTokenProvider.generateAccessToken(user.getId(), user.getEmail(), user.getRoles()))
                .refreshToken(refreshToken)
                .build();
    }

}
