package by.aresheg.restaurant.validation.password;

import by.aresheg.restaurant.domain.model.dto.request.RegistrationRequestDto;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class PasswordsMatchValidator implements ConstraintValidator<PasswordsMatch, RegistrationRequestDto> {
    @Override
    public boolean isValid(RegistrationRequestDto value, ConstraintValidatorContext context) {
        if (value == null) return true;
        else if(value.password() == null || value.passwordConfirmation() == null) return true;

        boolean passwordsMatch = value.password().equals(value.passwordConfirmation());

        if (!passwordsMatch) {
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate("Passwords don't match")
                    .addPropertyNode("confirmPassword")
                    .addConstraintViolation();
        }

        return passwordsMatch;
    }
}
