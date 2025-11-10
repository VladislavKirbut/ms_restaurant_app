package by.aresheg.notification.kafka;

import by.aresheg.notification.dto.UserRegisteredEvent;
import by.aresheg.notification.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class EmailKafkaListener {

    private final EmailService emailService;

    @KafkaListener(topics = "email-notifications", groupId = "notification-group")
    public void handleUserRegistration(UserRegisteredEvent event) {
        log.info("Received email notification: {}", event.email());

        emailService.sendRegistrationConfirmationEmail(event);
    }

}
