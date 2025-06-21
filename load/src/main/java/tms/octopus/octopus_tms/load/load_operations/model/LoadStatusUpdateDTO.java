package tms.octopus.octopus_tms.load.load_operations.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;
import tms.octopus.octopus_tms.base.load.model.LoadStatus;


@Getter
@Setter
public class LoadStatusUpdateDTO {

    @NotNull
    private UUID loadId;

    @NotNull
    private LoadStatus newStatus;

    @Size(max = 255)
    private String reason;

    @Size(max = 1000)
    private String notes;

    private UUID stopId;

    @NotNull
    private Boolean updateLocation;

    private Double latitude;

    private Double longitude;

    @NotNull
    private Boolean notifyParties;

}
