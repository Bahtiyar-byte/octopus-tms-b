package tms.octopus.octopus_tms.core.workflow_execution.model;

import jakarta.validation.constraints.Size;
import java.time.OffsetDateTime;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class WorkflowExecutionDTO {

    private UUID id;

    private UUID workflowId;

    @Size(max = 100)
    private String triggerType;

    private UUID triggerEntityId;

    @Size(max = 50)
    private String status;

    private OffsetDateTime startedAt;

    private OffsetDateTime completedAt;

    private String errorMessage;

    private String executionData;

}
