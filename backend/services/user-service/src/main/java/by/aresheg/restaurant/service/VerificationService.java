package by.aresheg.restaurant.service;

import by.aresheg.restaurant.domain.model.auth.dto.auth.JwtResponse;

public interface VerificationService {

    JwtResponse verifyEmail(String token);

}
