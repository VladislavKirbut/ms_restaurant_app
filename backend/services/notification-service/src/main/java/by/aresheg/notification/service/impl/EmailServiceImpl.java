package by.aresheg.notification.service.impl;

import by.aresheg.notification.dto.UserRegisteredEvent;
import by.aresheg.notification.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender javaMailSender;

    @Value("${app.email.from}")
    private String fromEmail;

    @Value("${app.email.verification.subject}")
    private String verificationSubject;

    @Value("${app.email.verification.url}")
    private String verificationUrl;

    @Override
    @Async
    public void sendRegistrationConfirmationEmail(UserRegisteredEvent dto) {
        try {
            String fullVerificationUrl = verificationUrl + dto.verificationToken();
            String text = buildEmailText(dto, fullVerificationUrl);

            sendEmail(dto.email(), text);

            log.info("Verification email sent to: {}", dto.email());
        } catch (Exception ex) {
            log.error("Failed to send verification email to: {}", dto.email(), ex);
        }

    }

    private void sendEmail(String toEmail, String text) {
        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(toEmail);
        message.setFrom(fromEmail);
        message.setSubject(verificationSubject);
        message.setText(text);

        javaMailSender.send(message);
    }

    private String buildEmailText(UserRegisteredEvent dto, String fullVerificationUrl) {
        return String.format(
                "Welcome to DeliveryPlatform, %s!\\n\\n" +
                        "Thank you for creating an account with us.\\n\\n" +
                        "Please verify your email address to activate your account and start using our delivery services:\\n" +
                        "%s\\n\\n" +
                        "This verification link expires in 24 hours.\\n\\n" +
                        "Happy delivering!\\nThe DeliveryPlatform Team",
                dto.fullName(),
                fullVerificationUrl
        );
    }

}
