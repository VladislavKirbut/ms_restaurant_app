package by.aresheg.notification.dto;

public record UserRegisteredEvent(
        String email,
        String fullName,
        String verificationToken
) {
}
