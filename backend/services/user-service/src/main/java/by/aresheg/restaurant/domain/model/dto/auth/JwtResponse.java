package by.aresheg.restaurant.domain.model.dto.auth;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class JwtResponse {

    private String accessToken;

    private String refreshToken;

}
