package by.aresheg.restaurant.service.impl;

import by.aresheg.restaurant.domain.exception.RoleNotFoundException;
import by.aresheg.restaurant.domain.model.dto.request.RegistrationRequestDto;
import by.aresheg.restaurant.domain.model.dto.response.RegistrationResponseDto;
import by.aresheg.restaurant.domain.model.dto.auth.JwtRequest;
import by.aresheg.restaurant.domain.model.dto.auth.JwtResponse;
import by.aresheg.restaurant.domain.exception.EmailAlreadyExistsException;
import by.aresheg.restaurant.domain.exception.PhoneAlreadyExistsException;
import by.aresheg.restaurant.domain.exception.UserNotFoundException;
import by.aresheg.restaurant.domain.model.role.Role;
import by.aresheg.restaurant.domain.model.user.UserStatus;
import by.aresheg.restaurant.mapper.RoleMapper;
import by.aresheg.restaurant.mapper.UserMapper;
import by.aresheg.restaurant.domain.model.user.User;
import by.aresheg.restaurant.repository.RoleRepository;
import by.aresheg.restaurant.repository.UserRepository;
import by.aresheg.restaurant.service.AuthService;
import by.aresheg.restaurant.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static by.aresheg.restaurant.domain.model.role.DefaultRoles.ROLE_USER;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;

    private final UserRepository userRepository;

    private final RoleRepository roleRepository;

    private final JwtTokenProvider jwtTokenProvider;

    private final UserMapper userMapper;

    private final RoleMapper roleMapper;

    private final PasswordEncoder passwordEncoder;

    @Override
    public JwtResponse login(JwtRequest loginRequest) {
        log.info("Registration attempt for email: {}", loginRequest.getEmail());

        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new UserNotFoundException(String.format("User not found with email: %s", loginRequest.getEmail())));

        return JwtResponse.builder()
                .accessToken(jwtTokenProvider.generateAccessToken(user.getId(), user.getEmail(), user.getRoles()))
                .refreshToken(jwtTokenProvider.generateRefreshToken(user.getId(), user.getEmail()))
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
                .findByName(ROLE_USER.name())
                .orElseThrow(() -> new RoleNotFoundException(String.format("Role '%s' not found in database", USER.name())));

        User user = userMapper.toEntity(request);
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.getRoles().add(role);
        user.setStatus(UserStatus.PENDING);

        userRepository.save(user);

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

}
