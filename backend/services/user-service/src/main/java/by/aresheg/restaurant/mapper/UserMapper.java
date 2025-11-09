package by.aresheg.restaurant.mapper;

import by.aresheg.restaurant.domain.model.dto.UserDto;
import by.aresheg.restaurant.domain.model.dto.request.RegistrationRequestDto;
import by.aresheg.restaurant.domain.model.dto.request.UpdateUserRequestDto;
import by.aresheg.restaurant.domain.model.dto.response.UserResponseDto;
import by.aresheg.restaurant.domain.model.user.User;
import org.mapstruct.*;

@Mapper(
        componentModel = MappingConstants.ComponentModel.SPRING,
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface UserMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "passwordHash", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "emailVerifiedAt", ignore = true)
    @Mapping(target = "roles", ignore = true)
    User toEntity(RegistrationRequestDto registrationRequestDto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "email", ignore = true)
    @Mapping(target = "passwordHash", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "emailVerifiedAt", ignore = true)
    @Mapping(target = "roles", ignore = true)
    void updateUserFromDto(UpdateUserRequestDto dto, @MappingTarget User user);

    UserResponseDto toDto(User user);

    UserDto toUserDto(User user);
}

// добавить изменение пароля и email  определиться в каких сервисах они должны быть
