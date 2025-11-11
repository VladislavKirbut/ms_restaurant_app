package by.aresheg.restaurant.service;

import by.aresheg.restaurant.domain.model.user.User;

public interface RefreshTokenService {

    void saveRefreshToken(User user, String refreshToken);

}
