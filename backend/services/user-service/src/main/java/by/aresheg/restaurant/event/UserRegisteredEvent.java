package by.aresheg.restaurant.event;

import lombok.Builder;

@Builder
public record UserRegisteredEvent(

        String email,

        String fullName,

        String verificationToken

) {
}
