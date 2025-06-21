package tms.octopus.octopus_tms.core.workflow_log.domain;

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
@Table(name = "WorkflowLogs")
@Getter
@Setter
public class WorkflowLog {

    @Id
    @Column(nullable = false, updatable = false)
    @GeneratedValue
    @UuidGenerator
    private UUID id;

    @Column
    private UUID executionId;

    @Column(length = 100)
    private String nodeId;

    @Column(length = 50)
    private String nodeType;

    @Column(length = 50)
    private String status;

    @Column(columnDefinition = "text")
    private String message;

    @Column(columnDefinition = "text")
    private String data;

    @Column
    private OffsetDateTime createdAt;

}
