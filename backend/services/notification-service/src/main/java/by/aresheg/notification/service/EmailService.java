package by.aresheg.notification.service;

import by.aresheg.notification.dto.UserRegisteredEvent;

public interface EmailService {

    void sendRegistrationConfirmationEmail(UserRegisteredEvent dto);

}
