package by.aresheg.restaurant.validation.password;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = PasswordsMatchValidator.class)
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface PasswordsMatch {

    String message() default "Passwords don't match";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};

}
