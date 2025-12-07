package in.sujeeth.backend.controllers;

import in.sujeeth.backend.dtos.EmailRequest;
import in.sujeeth.backend.dtos.ResponseDTO;
import in.sujeeth.backend.services.EmailGeneratorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/email")
public class EmailGeneratorController {

    @Autowired
    private EmailGeneratorService emailGeneratorService;

    @PostMapping("/generate")
    public ResponseEntity<ResponseDTO<String>> generateEmail(@RequestBody EmailRequest emailRequest) {
        ResponseDTO<String> responseDto;
        try {
            String response = emailGeneratorService.generateEmailReply(emailRequest);
            responseDto = ResponseDTO.<String>builder()
                    .data(response)
                    .success(true)
                    .errorMessage(null)
                    .build();
        } catch (Exception e) {
            responseDto = ResponseDTO.<String>builder()
                    .data(null)
                    .success(false)
                    .errorMessage(e.getMessage())
                    .build();
        }
        return ResponseEntity.ok(responseDto);
    }
}
