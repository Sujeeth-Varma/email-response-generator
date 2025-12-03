package in.sujeeth.backend.services;

import com.google.genai.Client;
import in.sujeeth.backend.dtos.EmailRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;


@Service
public class EmailGeneratorService {

//    gemini-client, api key is autoconfigured from application.properties
    Client client = new Client();

    @Value("${GEMINI_MODEL}")
    private String GEMINI_MODEL;

    public String generateEmailReply(EmailRequest emailRequest) {
        return client.models.generateContent(GEMINI_MODEL, "What is ai?", null).text();
    }
}
