package by.aresheg.restaurant.domain.model.dto.response;

import lombok.Builder;
import lombok.Data;

@Builder
public record RegistrationResponseDto(
        String email
) {
}
