package by.aresheg.restaurant.domain.model.auth.dto.auth;

import by.aresheg.restaurant.validation.password.ValidPassword;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record JwtRequest(

        @Schema(description = "The user email", example = "user@example.com", requiredMode = Schema.RequiredMode.REQUIRED)
        @Email(message = "The email is not valid")
        @NotBlank(message = "The email is required")
        String email,

        @Schema(description = "The user password", example = "P@ssw0rd!", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotBlank(message = "The password is required")
        @Size(min = 8, max = 64, message = "The password should be between 8 and 64 characters")
        @ValidPassword
        String password

) {
}
