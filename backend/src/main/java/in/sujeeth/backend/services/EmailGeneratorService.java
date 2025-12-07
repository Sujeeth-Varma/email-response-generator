package in.sujeeth.backend.services;

import com.google.common.collect.ImmutableList;
import com.google.genai.Client;
import com.google.genai.types.*;
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
        return client.models.generateContent(GEMINI_MODEL, emailRequest.getEmailContent(), getConfig(emailRequest.getTone())).text();
    }

    public GenerateContentConfig getConfig(String tone) {
        ImmutableList<SafetySetting> safetySettings =
                ImmutableList.of(
                        SafetySetting.builder()
                                .category(HarmCategory.Known.HARM_CATEGORY_HATE_SPEECH)
                                .threshold(HarmBlockThreshold.Known.BLOCK_ONLY_HIGH)
                                .build(),
                        SafetySetting.builder()
                                .category(HarmCategory.Known.HARM_CATEGORY_DANGEROUS_CONTENT)
                                .threshold(HarmBlockThreshold.Known.BLOCK_LOW_AND_ABOVE)
                                .build());

        if (tone == null) {
//            default tone
            tone = "Professional";
        }
        String sysInst = "You are a professional email replier, generate reply to the given email in " + tone + " tone, Since its a reply don't generate subject line";
        Content systemInstruction = Content.fromParts(Part.fromText(sysInst));

        return GenerateContentConfig.builder()
                // Sets the thinking budget to 0 to disable thinking mode
                .thinkingConfig(ThinkingConfig.builder().thinkingBudget(0))
                .candidateCount(1)
                .maxOutputTokens(1024)
                .safetySettings(safetySettings)
                .systemInstruction(systemInstruction)
                .build();
    }
}
