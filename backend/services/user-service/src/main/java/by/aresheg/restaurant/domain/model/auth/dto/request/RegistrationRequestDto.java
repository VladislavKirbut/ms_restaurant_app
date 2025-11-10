package by.aresheg.restaurant.domain.model.auth.dto.request;

import by.aresheg.restaurant.validation.email.ValidEmail;
import by.aresheg.restaurant.validation.phone.Phone;
import by.aresheg.restaurant.validation.password.ValidPassword;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegistrationRequestDto(

        @Schema(description = "The user email", example = "user@example.com", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotBlank(message = "The email is required")
        @ValidEmail
        String email,

        @Schema(description = "The user password", example = "P@ssw0rd!", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotBlank(message = "The password is required")
        @Size(min = 8, max = 64, message = "The password should be between 8 and 64 characters")
        @ValidPassword
        String password,

        @Schema(description = "Thу full name of the user", example = "John", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotBlank(message = "Full name is required")
        @Size(max = 100, message = "Full name must not exceed 100 characters")
        String fullName,

        @Schema(description = "The phone number in E.164 format", example = "+375291235689", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotBlank(message = "The phone number is required")
        @Phone
        String phone

) {
}
