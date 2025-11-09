package by.aresheg.restaurant.service;

import by.aresheg.restaurant.domain.model.dto.request.ChangePasswordRequestDto;
import by.aresheg.restaurant.domain.model.dto.request.UpdateUserRequestDto;
import by.aresheg.restaurant.domain.model.dto.response.UserResponseDto;
import by.aresheg.restaurant.domain.model.user.User;

import java.util.List;

public interface UserService {

    User getUserById(Long userId);

    User getUserByEmail(String email);

    List<UserResponseDto> getAllUsers();

    UserResponseDto updateUser(Long userId, UpdateUserRequestDto request);

    void updatePassword(Long id, ChangePasswordRequestDto request);

    void deleteUser(Long userId);

}
