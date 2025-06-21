package tms.octopus.octopus_tms.load.load_tracking.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class LoadTrackingDTO {

    private UUID id;

    private UUID driverId;

    @Digits(integer = 10, fraction = 6)
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    @Schema(type = "string", example = "84.0008")
    private BigDecimal latitude;

    @Digits(integer = 10, fraction = 6)
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    @Schema(type = "string", example = "39.0008")
    private BigDecimal longitude;

    @Size(max = 255)
    private String locationName;

    private Integer speed;

    private Integer heading;

    private Integer odometer;

    private Integer engineHours;

    private Integer fuelLevel;

    @Digits(integer = 5, fraction = 2)
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    @Schema(type = "string", example = "40.08")
    private BigDecimal temperature;

    @Size(max = 50)
    private String status;

    @Size(max = 100)
    private String eventType;

    private String notes;

    private OffsetDateTime createdAt;

    @NotNull
    private UUID load;

}
