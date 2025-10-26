package by.aresheg.restaurant.domain.model.dto.request;

import by.aresheg.restaurant.validation.password.ValidPassword;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ChangePasswordRequestDto(

        @Schema(description = "The user old password", example = "P@ssw0rd!", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotBlank(message = "The old password is required")
        @Size(min = 8, max = 64, message = "The password should be between 8 and 64 characters")
        @ValidPassword
        String currentPassword,

        @Schema(description = "The user new password", example = "newP@ssw0rd", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotBlank(message = "The new password is required")
        @Size(min = 8, max = 64, message = "The password should be between 8 and 64 characters")
        @ValidPassword
        String newPassword

) {
}
