package by.aresheg.restaurant.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    private static final String SECURITY_SCHEME_NAME = "bearerAuth";

    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                .addSecurityItem(new SecurityRequirement().addList(SECURITY_SCHEME_NAME))
                .components(
                    new Components()
                            .addSecuritySchemes(SECURITY_SCHEME_NAME,
                                    new SecurityScheme()
                                            .type(SecurityScheme.Type.HTTP)
                                            .scheme("bearer")
                                            .bearerFormat("JWT"))
                )
                .info(new Info()
                        .title("Food Delivery Platform API")
                        .description("""
                                REST API for the Food Delivery Platform.
                                Provides endpoints for user management, authentication, and order processing.
                                """)
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Aresheg.by")
                                .email("aresheg@gmail.com"))
                );
    }
}
