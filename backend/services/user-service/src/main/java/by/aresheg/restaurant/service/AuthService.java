package by.aresheg.restaurant.service;

import by.aresheg.restaurant.domain.model.auth.dto.request.RegistrationRequestDto;
import by.aresheg.restaurant.domain.model.auth.dto.response.RegistrationResponseDto;
import by.aresheg.restaurant.domain.model.auth.dto.auth.JwtRequest;
import by.aresheg.restaurant.domain.model.auth.dto.auth.JwtResponse;

public interface AuthService {

    JwtResponse login(JwtRequest loginRequest);

    JwtResponse refresh(String refreshToken);

    RegistrationResponseDto register(RegistrationRequestDto registrationRequestDto);

}
