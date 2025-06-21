package tms.octopus.octopus_tms.core.audit_log.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.OffsetDateTime;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class AuditLogDTO {

    private UUID id;

    private UUID userId;

    private UUID companyId;

    @NotNull
    @Size(max = 100)
    private String action;

    @Size(max = 100)
    private String entityType;

    private UUID entityId;

    private String oldValues;

    private String newValues;

    @Size(max = 255)
    private String ipAddress;

    private String userAgent;

    private OffsetDateTime createdAt;

}
