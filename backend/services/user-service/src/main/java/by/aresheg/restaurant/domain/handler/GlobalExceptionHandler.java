package by.aresheg.restaurant.domain.handler;

import by.aresheg.restaurant.domain.exception.*;
import by.aresheg.restaurant.domain.exception.auth.InvalidTokenException;
import by.aresheg.restaurant.domain.exception.auth.VerificationException;
import by.aresheg.restaurant.domain.model.auth.dto.response.ApiErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.Map;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler({
            UserNotFoundException.class,
            RoleNotFoundException.class
    })
    public ResponseEntity<ApiErrorResponse> handleUserNotFound(UserNotFoundException ex, HttpServletRequest request) {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(new ApiErrorResponse(
                        false,
                        ex.getMessage(),
                        "NOT_FOUND",
                        Instant.now(),
                        request.getRequestURI(),
                        null
                ));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleValidationErrors(MethodArgumentNotValidException ex, HttpServletRequest request) {

        Map<String, String> errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .collect(Collectors.toMap(
                        FieldError::getField,
                        FieldError::getDefaultMessage,
                        (existing, replacement) -> existing
                ));

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(new ApiErrorResponse(
                        false,
                        "Validation failed",
                        "BAD_REQUEST",
                        Instant.now(),
                        request.getRequestURI(),
                        errors
                ));
    }

    @ExceptionHandler({
            EmailAlreadyExistsException.class,
            PhoneAlreadyExistsException.class
    })
    public ResponseEntity<ApiErrorResponse> handleConflictExceptions(
            RuntimeException ex, HttpServletRequest request) {

        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(new ApiErrorResponse(
                        false,
                        ex.getMessage(),
                        "CONFLICT",
                        Instant.now(),
                        request.getRequestURI(),
                        null
                ));
    }

    @ExceptionHandler({
            InvalidTokenException.class,
            InvalidPasswordException.class
    })
    public ResponseEntity<ApiErrorResponse> handleSecurityExceptions(
            RuntimeException ex, HttpServletRequest request) {

        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(new ApiErrorResponse(
                        false,
                        ex.getMessage(),
                        "SECURITY_ERROR",
                        Instant.now(),
                        request.getRequestURI(),
                        null
                ));
    }


    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiErrorResponse> handleAccessDenied(
            AccessDeniedException ex, HttpServletRequest request) {

        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(new ApiErrorResponse(
                        false,
                        ex.getMessage(),
                        "ACCESS_DENIED",
                        Instant.now(),
                        request.getRequestURI(),
                        null
                ));
    }

    @ExceptionHandler(VerificationException.class)
    public ResponseEntity<ApiErrorResponse> handleVerificationException(
            VerificationException ex, HttpServletRequest request) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(new ApiErrorResponse(
                        false,
                        ex.getMessage(),
                        "BAD_REQUEST",
                        Instant.now(),
                        request.getRequestURI(),
                        null
                ));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleAllExceptions(
            Exception ex, HttpServletRequest request) {

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiErrorResponse(
                        false,
                        "Internal server error",
                        "INTERNAL_ERROR",
                        Instant.now(),
                        request.getRequestURI(),
                        null
                ));
    }

}
