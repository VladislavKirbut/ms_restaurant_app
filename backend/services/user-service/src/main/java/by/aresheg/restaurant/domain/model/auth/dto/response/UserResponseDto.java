package by.aresheg.restaurant.domain.model.auth.dto.response;

import by.aresheg.restaurant.domain.model.user.UserStatus;

public record UserResponseDto(

        Long id,

        String email,

        String fullName,

        String phone,

        UserStatus status

) {
}
