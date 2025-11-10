package by.aresheg.restaurant.controller.api;

import by.aresheg.restaurant.domain.model.auth.dto.request.RegistrationRequestDto;
import by.aresheg.restaurant.domain.model.auth.dto.response.RegistrationResponseDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;

@Tag(name = "Auth Controller", description = "Auth API")
public interface AuthControllerAPI {

    @Operation(
            summary = "Create a user",
            description = "Registers a new user",
            responses = {
                    @ApiResponse(
                            responseCode = "201",
                            description = "The user has been successfully created",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = String.class)
                            )
                    )
            }
    )
    ResponseEntity<by.aresheg.restaurant.domain.model.auth.dto.response.ApiResponse<RegistrationResponseDto>> register(@RequestBody RegistrationRequestDto request);

}
