package tms.octopus.octopus_tms.load.load_status_history.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.OffsetDateTime;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class LoadStatusHistoryDTO {

    private UUID id;

    private UUID loadId;

    @Size(max = 255)
    private String oldStatus;

    @NotNull
    @Size(max = 255)
    private String newStatus;

    @Size(max = 255)
    private String changeReason;

    private String notes;

    private OffsetDateTime createdAt;

}
