package tms.octopus.octopus_tms.core.ai_provider_config.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.OffsetDateTime;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class AiProviderConfigDTO {

    private Long id;

    @NotNull
    private UUID userId;

    @NotNull
    @Size(max = 50)
    private String provider;

    private String apiKey;

    private String oauthToken;

    private String oauthRefreshToken;

    @JsonProperty("isActive")
    private Boolean isActive;

    @Size(max = 20)
    private String connectionStatus;

    private OffsetDateTime lastTested;

    @NotNull
    private OffsetDateTime createdAt;

    @NotNull
    private OffsetDateTime updatedAt;

}
