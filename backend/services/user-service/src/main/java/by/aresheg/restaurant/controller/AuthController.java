package by.aresheg.restaurant.controller;

import by.aresheg.restaurant.controller.api.AuthControllerAPI;
import by.aresheg.restaurant.domain.model.auth.dto.response.ApiResponse;
import by.aresheg.restaurant.domain.model.auth.dto.request.RegistrationRequestDto;
import by.aresheg.restaurant.domain.model.auth.dto.response.RegistrationResponseDto;
import by.aresheg.restaurant.domain.model.auth.dto.auth.JwtRequest;
import by.aresheg.restaurant.domain.model.auth.dto.auth.JwtResponse;
import by.aresheg.restaurant.service.AuthService;
import by.aresheg.restaurant.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static by.aresheg.restaurant.shared.enums.MessageCode.*;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/auth")
public class AuthController implements AuthControllerAPI {

    private final AuthService authService;

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<RegistrationResponseDto>> register(@RequestBody @Valid RegistrationRequestDto request) {
        ApiResponse<RegistrationResponseDto> build = ApiResponse.<RegistrationResponseDto>builder()
                .success(true)
                .message(REGISTRATION_SUCCESS.getMessage())
                .messageCode(REGISTRATION_SUCCESS.getMessageCode())
                .data(authService.register(request))
                .build();
        log.info("" + build);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(build);

    }

    @PostMapping("/verify-email")
    public ResponseEntity<ApiResponse<JwtResponse>> verifyEmail(@RequestParam String token) {
        return null;
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<JwtResponse>> login(@RequestBody @Valid JwtRequest request) {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(ApiResponse.<JwtResponse>builder()
                        .success(true)
                        .message(LOGIN_SUCCESS.getMessage())
                        .messageCode(LOGIN_SUCCESS.getMessageCode())
                        .data(authService.login(request))
                        .build()
        );
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<JwtResponse>> refresh(@RequestBody String refreshToken) {
        return null;
    }

}
