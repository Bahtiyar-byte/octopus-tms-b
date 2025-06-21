package tms.octopus.octopus_tms.core.workflow.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.OffsetDateTime;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class WorkflowDTO {

    private UUID id;

    private UUID companyId;

    @NotNull
    @Size(max = 255)
    private String name;

    private String description;

    @NotNull
    @Size(max = 50)
    private String moduleType;

    @Size(max = 50)
    private String status;

    private Integer version;

    @NotNull
    private String workflowData;

    private UUID createdBy;

    private OffsetDateTime createdAt;

    private OffsetDateTime updatedAt;

}
