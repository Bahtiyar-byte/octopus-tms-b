package tms.octopus.octopus_tms.load.load_assignment.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.OffsetDateTime;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class LoadAssignmentDTO {

    private UUID id;

    @NotNull
    private UUID loadId;

    @NotNull
    @Size(max = 50)
    private String assignmentType;

    private UUID assignedToId;

    private UUID assignedToCompanyId;

    @NotNull
    private OffsetDateTime assignedAt;

    private OffsetDateTime unassignedAt;

    @Size(max = 255)
    private String assignmentReason;

    @Size(max = 255)
    private String unassignmentReason;

    private String notes;

    private UUID assignedBy;

    private UUID unassignedBy;

}
