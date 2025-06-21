package tms.octopus.octopus_tms.core.audit_log.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.OffsetDateTime;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;


@Entity
@Table(name = "AuditLogs")
@Getter
@Setter
public class AuditLog {

    @Id
    @Column(nullable = false, updatable = false)
    @GeneratedValue
    @UuidGenerator
    private UUID id;

    @Column
    private UUID userId;

    @Column
    private UUID companyId;

    @Column(nullable = false, length = 100)
    private String action;

    @Column(length = 100)
    private String entityType;

    @Column
    private UUID entityId;

    @Column(columnDefinition = "text")
    private String oldValues;

    @Column(columnDefinition = "text")
    private String newValues;

    @Column
    private String ipAddress;

    @Column(columnDefinition = "text")
    private String userAgent;

    @Column
    private OffsetDateTime createdAt;

}
