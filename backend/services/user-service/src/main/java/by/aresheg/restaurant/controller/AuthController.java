package by.aresheg.restaurant.controller;

import by.aresheg.restaurant.controller.api.AuthControllerAPI;
import by.aresheg.restaurant.domain.model.dto.ApiResponse;
import by.aresheg.restaurant.domain.model.dto.request.RegistrationRequestDto;
import by.aresheg.restaurant.domain.model.dto.response.RegistrationResponseDto;
import by.aresheg.restaurant.domain.model.dto.auth.JwtRequest;
import by.aresheg.restaurant.domain.model.dto.auth.JwtResponse;
import by.aresheg.restaurant.service.AuthService;
import by.aresheg.restaurant.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static by.aresheg.restaurant.shared.enums.MessageCode.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController implements AuthControllerAPI {

    private final AuthService authService;

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<RegistrationResponseDto>> register(@RequestBody @Valid RegistrationRequestDto request) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.<RegistrationResponseDto>builder()
                        .success(true)
                        .message(REGISTRATION_SUCCESS.getMessage())
                        .messageCode(REGISTRATION_SUCCESS.getMessageCode())
                        .data(authService.register(request))
                        .build()
                );
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
