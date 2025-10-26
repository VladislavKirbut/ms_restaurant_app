package by.aresheg.restaurant.config;

import by.aresheg.restaurant.security.props.JwtProperties;
import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;

@Configuration
@RequiredArgsConstructor
public class ApplicationConfig {

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public Algorithm jwtAlgorithm(JwtProperties jwtProperties) {
        return Algorithm.HMAC256(jwtProperties.getSecret());
    }

    @Bean
    public JWTVerifier jwtVerifier(Algorithm algorithm) {
        return JWT.require(algorithm).build();
    }

}
