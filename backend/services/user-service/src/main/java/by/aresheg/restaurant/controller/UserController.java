package by.aresheg.restaurant.controller;

import by.aresheg.restaurant.domain.model.dto.ApiResponse;
import by.aresheg.restaurant.domain.model.dto.request.ChangePasswordRequestDto;
import by.aresheg.restaurant.domain.model.dto.request.UpdateUserRequestDto;
import by.aresheg.restaurant.domain.model.dto.response.UserResponseDto;
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
        return ResponseEntity.ok().body(new ApiResponse<>(
                true,
                USER_RETRIEVED_SUCCESS.getMessage(),
                USER_RETRIEVED_SUCCESS.getMessageCode(),
                userMapper.toDto(userService.getUserById(id))
        ));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<UserResponseDto>>> findAll() {
        return ResponseEntity.ok().body(new ApiResponse<>(
                true,
                USERS_RETRIEVED_SUCCESS.getMessage(),
                USERS_RETRIEVED_SUCCESS.getMessageCode(),
                userService.getAllUsers()
        ));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponseDto>> updateUser(@PathVariable Long id, @RequestBody @Valid UpdateUserRequestDto request) {
        return ResponseEntity.ok().body(new ApiResponse<>(
                true,
                USER_UPDATE_SUCCESS.getMessage(),
                USER_UPDATE_SUCCESS.getMessageCode(),
                userService.updateUser(id, request)
        ));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        return ResponseEntity.ok().body(new ApiResponse<>(
                true,
                USER_DELETED_SUCCESS.getMessage(),
                USER_DELETED_SUCCESS.getMessageCode(),
                null
        ));
    }

    @PostMapping("/{id}/change-password")
    private ResponseEntity<ApiResponse<Void>> changePassword(@PathVariable Long id, @RequestBody @Valid ChangePasswordRequestDto request) {
        return ResponseEntity.ok().body(new ApiResponse<>(
                true,
                PASSWORD_CHANGE_SUCCESS.getMessage(),
                PASSWORD_CHANGE_SUCCESS.getMessageCode(),
                null
        ));
    }

}
