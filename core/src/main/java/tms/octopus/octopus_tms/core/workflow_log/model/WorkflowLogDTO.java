package tms.octopus.octopus_tms.core.workflow_log.model;

import jakarta.validation.constraints.Size;
import java.time.OffsetDateTime;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class WorkflowLogDTO {

    private UUID id;

    private UUID executionId;

    @Size(max = 100)
    private String nodeId;

    @Size(max = 50)
    private String nodeType;

    @Size(max = 50)
    private String status;

    private String message;

    private String data;

    private OffsetDateTime createdAt;

}
