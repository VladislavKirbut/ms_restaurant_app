package by.aresheg.restaurant.domain.model.auth.dto.response;

import java.time.Instant;
import java.util.Map;

public record ApiErrorResponse(

        boolean success,

        String message,

        String errorCode,

        Instant timestamp,

        String path,

        Map<String, String> details

) {
}
