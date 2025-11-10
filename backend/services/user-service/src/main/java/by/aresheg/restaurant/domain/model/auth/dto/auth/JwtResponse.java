package by.aresheg.restaurant.domain.model.auth.dto.auth;

import lombok.Builder;

@Builder
public record JwtResponse(

        String accessToken,

        String refreshToken

) {
}
