package tms.octopus.octopus_tms.core.ai_provider_config.domain;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "ai_provider_configs")
@Getter
@Setter
public class AiProviderConfig {

    @Id
    @Column(nullable = false, updatable = false)
    @SequenceGenerator(
            name = "primary_sequence",
            sequenceName = "primary_sequence",
            allocationSize = 1,
            initialValue = 10000
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "primary_sequence"
    )
    private Long id;

    @Column(nullable = false)
    private UUID userId;

    @Column(nullable = false, length = 50)
    private String provider;

    @Column(columnDefinition = "text")
    private String apiKey;

    @Column(columnDefinition = "text")
    private String oauthToken;

    @Column(columnDefinition = "text")
    private String oauthRefreshToken;

    @Column
    private Boolean isActive;

    @Column(length = 20)
    private String connectionStatus;

    @Column
    private OffsetDateTime lastTested;

    @Column(nullable = false)
    private OffsetDateTime createdAt;

    @Column(nullable = false)
    private OffsetDateTime updatedAt;
    
    @Column(columnDefinition = "text")
    private String additionalSettings;
}