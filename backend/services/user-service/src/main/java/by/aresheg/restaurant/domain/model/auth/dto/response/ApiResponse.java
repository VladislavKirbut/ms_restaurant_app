package by.aresheg.restaurant.domain.model.auth.dto.response;

import lombok.Builder;

@Builder
public record ApiResponse<T>(

        boolean success,

        String message,

        String messageCode,

        T data

) {
}
