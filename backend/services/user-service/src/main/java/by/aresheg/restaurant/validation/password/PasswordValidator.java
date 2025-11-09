package by.aresheg.restaurant.validation.password;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.Set;

public class PasswordValidator implements ConstraintValidator<ValidPassword, String> {

    private static final Set<Character> SPECIALS = Set.of(
            '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', '[', ']', '{', '}', '|', ';', ':', ',', '.', '<', '>'
    );

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null || value.length() < 8 || value.length() > 64) return false;

        boolean hasUpper = false, hasLower = false, hasDigit = false, hasSpecial = false;

        for (char ch : value.toCharArray()) {
            if (Character.isUpperCase(ch)) hasUpper = true;
            else if (Character.isLowerCase(ch)) hasLower = true;
            else if (Character.isDigit(ch)) hasDigit = true;
            else if (SPECIALS.contains(ch)) hasSpecial = true;

            if (hasUpper && hasLower && hasDigit && hasSpecial) break;
        }

        return hasUpper && hasLower && hasDigit && hasSpecial;
    }

}
