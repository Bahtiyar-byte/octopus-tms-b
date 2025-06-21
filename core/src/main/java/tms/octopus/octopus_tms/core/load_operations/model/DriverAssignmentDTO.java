package tms.octopus.octopus_tms.core.load_operations.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class DriverAssignmentDTO {

    @NotNull
    private UUID driverId;

    private UUID equipmentId;

    @Size(max = 1000)
    private String notes;

}
