package by.aresheg.restaurant.service.impl;

import by.aresheg.restaurant.domain.exception.RoleNotFoundException;
import by.aresheg.restaurant.domain.model.auth.RefreshToken;
import by.aresheg.restaurant.domain.model.auth.dto.request.RegistrationRequestDto;
import by.aresheg.restaurant.domain.model.auth.dto.response.RegistrationResponseDto;
import by.aresheg.restaurant.domain.model.auth.dto.auth.JwtRequest;
import by.aresheg.restaurant.domain.model.auth.dto.auth.JwtResponse;
import by.aresheg.restaurant.domain.exception.EmailAlreadyExistsException;
import by.aresheg.restaurant.domain.exception.PhoneAlreadyExistsException;
import by.aresheg.restaurant.domain.exception.UserNotFoundException;
import by.aresheg.restaurant.domain.model.role.Role;
import by.aresheg.restaurant.domain.model.user.UserStatus;
import by.aresheg.restaurant.domain.model.verification.VerificationToken;
import by.aresheg.restaurant.event.UserRegisteredEvent;
import by.aresheg.restaurant.mapper.UserMapper;
import by.aresheg.restaurant.domain.model.user.User;
import by.aresheg.restaurant.repository.RefreshTokenRepository;
import by.aresheg.restaurant.repository.RoleRepository;
import by.aresheg.restaurant.repository.UserRepository;
import by.aresheg.restaurant.repository.VerificationTokenRepository;
import by.aresheg.restaurant.service.AuthService;
import by.aresheg.restaurant.security.JwtTokenProvider;
import by.aresheg.restaurant.service.RefreshTokenService;
import by.aresheg.restaurant.service.kafka.KafkaEventProducer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

import static by.aresheg.restaurant.domain.model.role.DefaultRoles.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private static final Integer VERIFICATION_TOKEN_TIME_TO_LIVE = 24;

    private final AuthenticationManager authenticationManager;

    private final UserRepository userRepository;

    private final RoleRepository roleRepository;

    private final VerificationTokenRepository verificationTokenRepository;

    private final RefreshTokenService refreshTokenService;

    private final JwtTokenProvider jwtTokenProvider;

    private final UserMapper userMapper;

    private final KafkaEventProducer kafkaEventProducer;

    private final PasswordEncoder passwordEncoder;

    @Override
    public JwtResponse login(JwtRequest loginRequest) {
        log.info("Registration attempt for email: {}", loginRequest.email());

        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.email(), loginRequest.password()));
        User user = userRepository.findByEmail(loginRequest.email())
                .orElseThrow(() -> new UserNotFoundException(String.format("User not found with email: %s", loginRequest.email())));

        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getId(), user.getEmail());
        refreshTokenService.saveRefreshToken(user, refreshToken);

        return JwtResponse.builder()
                .accessToken(jwtTokenProvider.generateAccessToken(user.getId(), user.getEmail(), user.getRoles()))
                .refreshToken(refreshToken)
                .build();
    }

    @Override
    public JwtResponse refresh(String refreshToken) {
        return jwtTokenProvider.refreshTokens(refreshToken);
    }

    @Override
    @Transactional
    public RegistrationResponseDto register(RegistrationRequestDto request) {
        checkUserExists(request);

        Role role = roleRepository
                .findByName(USER.name())
                .orElseThrow(() -> new RoleNotFoundException(String.format("Role '%s' not found in database", USER.name())));

        User user = userMapper.toEntity(request);
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.getRoles().add(role);
        user.setStatus(UserStatus.PENDING);

        userRepository.save(user);

        String verificationToken = UUID.randomUUID().toString();

        saveVerificationToken(user, verificationToken);

        kafkaEventProducer.sendUserRegisteredEvent(
                UserRegisteredEvent.builder()
                        .email(user.getEmail())
                        .fullName(user.getFullName())
                        .verificationToken(verificationToken)
                        .build()
        );

        return RegistrationResponseDto.builder()
                .email(user.getEmail())
                .build();
    }

    private void checkUserExists(RegistrationRequestDto request) {
        if (userRepository.existsByEmail(request.email()))
            throw new EmailAlreadyExistsException(String.format(
                    "Email '%s' already exists", request.email()
            ));

        if (userRepository.existsByPhone(request.phone()))
            throw new PhoneAlreadyExistsException(String.format(
                    "Phone '%s' already exists", request.phone()
            ));
    }

    private void saveVerificationToken(User user, String token) {
        VerificationToken verificationToken = VerificationToken.builder()
                .token(token)
                .createdAt(Instant.now())
                .expiresAt(Instant.now().plus(VERIFICATION_TOKEN_TIME_TO_LIVE, ChronoUnit.HOURS))
                .user(user)
                .build();

        verificationTokenRepository.save(verificationToken);
    }

}
