package by.aresheg.gateway.config;

import by.aresheg.gateway.security.props.JwtProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.jwt.NimbusReactiveJwtDecoder;
import org.springframework.security.oauth2.jwt.ReactiveJwtDecoder;

import javax.crypto.spec.SecretKeySpec;

@Configuration
@RequiredArgsConstructor
public class ApplicationConfig {

    private final JwtProperties jwtProperties;

    @Bean
    public ReactiveJwtDecoder reactiveJwtDecoder() {
        return NimbusReactiveJwtDecoder.withSecretKey(
                new SecretKeySpec(jwtProperties.getSecret().getBytes(), "HmacSHA256")
        ).build();
    }

}
