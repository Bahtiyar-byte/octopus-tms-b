package tms.octopus.octopus_tms.load.load_operations.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class LoadTrackingUpdateDTO {

    @NotNull
    private UUID loadId;

    @NotNull
    private Double latitude;

    @NotNull
    private Double longitude;

    @Size(max = 255)
    private String locationName;

    private Integer speed;

    private Integer heading;

    @Size(max = 100)
    private String eventType;

    private Double temperature;

    private LocalDateTime estimatedArrival;

    private UUID currentStopId;

    private UUID nextStopId;

}
