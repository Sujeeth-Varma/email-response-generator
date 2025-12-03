package in.sujeeth.backend.dtos;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ResponseDTO<T> {
    private T data;
    private boolean success;
    private String errorMessage;
}
