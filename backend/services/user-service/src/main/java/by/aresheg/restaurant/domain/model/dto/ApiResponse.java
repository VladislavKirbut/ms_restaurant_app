package by.aresheg.restaurant.domain.model.dto;

import lombok.Builder;

@Builder
public class ApiResponse<T> {

    private boolean success;
    private String message;
    private String messageCode;
    private T data;

}
