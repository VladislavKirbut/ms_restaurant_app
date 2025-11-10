package by.aresheg.restaurant.validation.phone;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = PhoneValidator.class)
@Retention(RetentionPolicy.RUNTIME)
@Target({ ElementType.FIELD, ElementType.PARAMETER })
public @interface Phone {

    String message() default "The number or country format is not valid";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};

}
