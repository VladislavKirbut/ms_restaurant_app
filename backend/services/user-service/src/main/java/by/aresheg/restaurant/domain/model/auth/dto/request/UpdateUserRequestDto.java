package by.aresheg.restaurant.domain.model.auth.dto.request;

import by.aresheg.restaurant.validation.phone.Phone;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateUserRequestDto(

    @Schema(description = "Thу full name of the user", example = "John", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "The name is required")
    @Size(max = 100, message = "The name must be at most 100 characters")
    String fullName,

    @Schema(description = "The phone number in E.164 format", example = "+375291235689", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "The phone number is required")
    @Phone
    String phone

) {
}
