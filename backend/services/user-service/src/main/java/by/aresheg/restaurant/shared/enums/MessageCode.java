package by.aresheg.restaurant.shared.enums;

import lombok.Getter;

@Getter
public enum MessageCode {

    // Success
    REGISTRATION_SUCCESS("REGISTRATION_SUCCESS", "Registration successful. Please check your email for verification link"),
    LOGIN_SUCCESS("LOGIN SUCCESS", "Login successful"),
    USER_UPDATE_SUCCESS("USER_UPDATE_SUCCESS", "User profile updated successfully"),
    USERS_RETRIEVED_SUCCESS("USERS_RETRIEVED_SUCCESS", "Users retrieved successfully"),
    USER_RETRIEVED_SUCCESS("USER_RETRIEVED_SUCCESS", "User retrieved successfully"),
    USER_DELETED_SUCCESS("USER_DELETED_SUCCESS", "User deleted successfully"),
    PASSWORD_CHANGE_SUCCESS("PASSWORD_CHANGE_SUCCESS", "Password changed successfully"),

    EMAIL_VERIFIED_SUCCESS("EMAIL_VERIFIED_SUCCESS", "Email verified successfully");

    private final String messageCode;

    private final String message;

    MessageCode(String messageCode, String message) {
        this.message = message;
        this.messageCode = messageCode;
    }

}
