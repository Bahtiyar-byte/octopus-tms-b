package tms.octopus.octopus_tms.load.load_stop.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;
import tms.octopus.octopus_tms.base.load_stop.model.StopType;


@Getter
@Setter
public class LoadStopDTO {

    private UUID id;

    @NotNull
    private Integer stopNumber;

    @NotNull
    private StopType stopType;

    private UUID companyId;

    private UUID warehouseId;

    @Size(max = 255)
    private String locationName;

    @Size(max = 255)
    private String addressLine1;

    @Size(max = 255)
    private String addressLine2;

    @Size(max = 100)
    private String city;

    @Size(max = 50)
    private String state;

    @Size(max = 20)
    private String zipCode;

    @Size(max = 50)
    private String country;

    @Digits(integer = 10, fraction = 6)
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    @Schema(type = "string", example = "84.0008")
    private BigDecimal latitude;

    @Digits(integer = 10, fraction = 6)
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    @Schema(type = "string", example = "39.0008")
    private BigDecimal longitude;

    @Size(max = 255)
    private String contactName;

    @Size(max = 50)
    private String contactPhone;

    @Size(max = 255)
    private String contactEmail;

    private LocalDate scheduledDate;

    @Schema(type = "string", example = "18:30")
    private LocalTime scheduledTimeStart;

    @Schema(type = "string", example = "18:30")
    private LocalTime scheduledTimeEnd;

    private OffsetDateTime actualArrival;

    private OffsetDateTime actualDeparture;

    private String notes;

    private String specialInstructions;

    private OffsetDateTime createdAt;

    private OffsetDateTime updatedAt;

    @NotNull
    private UUID load;

}
