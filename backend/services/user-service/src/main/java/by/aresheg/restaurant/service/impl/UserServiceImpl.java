package by.aresheg.restaurant.service.impl;

import by.aresheg.restaurant.domain.exception.InvalidPasswordException;
import by.aresheg.restaurant.domain.model.auth.dto.request.ChangePasswordRequestDto;
import by.aresheg.restaurant.domain.model.auth.dto.request.UpdateUserRequestDto;
import by.aresheg.restaurant.domain.model.auth.dto.response.UserResponseDto;
import by.aresheg.restaurant.service.UserService;
import by.aresheg.restaurant.domain.exception.UserNotFoundException;
import by.aresheg.restaurant.mapper.UserMapper;
import by.aresheg.restaurant.domain.model.user.User;
import by.aresheg.restaurant.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    private final UserMapper userMapper;

    public User getUserById(Long userId) {
        return userRepository.findById(userId).
                orElseThrow(() -> new UserNotFoundException(
                        String.format("User not found with id: %s", userId)
                ));
    }

    @Override
    public User getUserByEmail(String email) {
       return userRepository.findByEmail(email)
               .orElseThrow(() -> new UserNotFoundException(String.format("User not found with email: %s", email)));
    }

    @Override
    public List<UserResponseDto> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map((userMapper::toDto))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public UserResponseDto updateUser(Long userId, UpdateUserRequestDto request) {
        User user = getUserById(userId);

        userMapper.updateUserFromDto(request, user);
        User updatedUser = userRepository.save(user);

        return userMapper.toDto(updatedUser);
    }

    @Override
    @Transactional
    public void updatePassword(Long id, ChangePasswordRequestDto request) {
        User user = getUserById(id);
        if (request.currentPassword().equals(user.getPasswordHash())) {
            throw new InvalidPasswordException("The current password is incorrect");
        }

        user.setPasswordHash(request.newPassword());
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void deleteUser(Long userId) {
        User user = getUserById(userId);
        userRepository.delete(user);
    }

}
