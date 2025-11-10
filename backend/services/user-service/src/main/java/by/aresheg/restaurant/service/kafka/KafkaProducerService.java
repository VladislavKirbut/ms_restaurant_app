package by.aresheg.restaurant.service.kafka;

import by.aresheg.restaurant.event.UserRegisteredEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class KafkaProducerService implements KafkaEventProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    @Value("${app.kafka.topic}")
    private String kafkaTopic;

    @Override
    public void sendUserRegisteredEvent(UserRegisteredEvent event) {
        kafkaTemplate.send(kafkaTopic, event);
    }

}
