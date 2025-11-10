package by.aresheg.restaurant.controller;

import by.aresheg.restaurant.domain.model.auth.dto.response.ApiResponse;
import by.aresheg.restaurant.domain.model.auth.dto.request.ChangePasswordRequestDto;
import by.aresheg.restaurant.domain.model.auth.dto.request.UpdateUserRequestDto;
import by.aresheg.restaurant.domain.model.auth.dto.response.UserResponseDto;
import by.aresheg.restaurant.mapper.UserMapper;
import by.aresheg.restaurant.service.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static by.aresheg.restaurant.shared.enums.MessageCode.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/users")
@Tag(name = "User Controller", description = "User API")
public class UserController {

    private final UserService userService;

    private final UserMapper userMapper;

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponseDto>> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok().body(ApiResponse.<UserResponseDto>builder()
                .success(true)
                .message(USER_RETRIEVED_SUCCESS.getMessage())
                .messageCode(USER_RETRIEVED_SUCCESS.getMessageCode())
                .data(userMapper.toDto(userService.getUserById(id)))
                .build()
        );
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<UserResponseDto>>> findAll() {
        return ResponseEntity.ok().body(ApiResponse.<List<UserResponseDto>>builder()
                .success(true)
                .message(USERS_RETRIEVED_SUCCESS.getMessage())
                .messageCode(USERS_RETRIEVED_SUCCESS.getMessageCode())
                .data(userService.getAllUsers())
                .build()
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponseDto>> updateUser(@PathVariable Long id, @RequestBody @Valid UpdateUserRequestDto request) {
        return ResponseEntity.ok().body(ApiResponse.<UserResponseDto>builder()
                .success(true)
                .message(USER_UPDATE_SUCCESS.getMessage())
                .messageCode(USER_UPDATE_SUCCESS.getMessageCode())
                .data(userService.updateUser(id, request))
                .build()
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        return ResponseEntity.ok().body(ApiResponse.<Void>builder()
                .success(true)
                .message(USER_DELETED_SUCCESS.getMessage())
                .messageCode(USER_DELETED_SUCCESS.getMessageCode())
                .data(null)
                .build()
        );
    }

    @PostMapping("/{id}/change-password")
    private ResponseEntity<ApiResponse<Void>> changePassword(@PathVariable Long id, @RequestBody @Valid ChangePasswordRequestDto request) {
        return ResponseEntity.ok().body(ApiResponse.<Void>builder()
                .success(true)
                .message(PASSWORD_CHANGE_SUCCESS.getMessage())
                .messageCode(PASSWORD_CHANGE_SUCCESS.getMessageCode())
                .data(null)
                .build()
        );
    }

}
