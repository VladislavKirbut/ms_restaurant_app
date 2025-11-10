package by.aresheg.restaurant.service.kafka;

import by.aresheg.restaurant.event.UserRegisteredEvent;

public interface KafkaEventProducer {

    void sendUserRegisteredEvent(UserRegisteredEvent event);

}
