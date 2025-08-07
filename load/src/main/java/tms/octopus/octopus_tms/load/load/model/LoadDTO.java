package tms.octopus.octopus_tms.load.load.model;

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
import tms.octopus.octopus_tms.base.load.model.EquipmentType;
import tms.octopus.octopus_tms.base.load.model.LoadStatus;
import tms.octopus.octopus_tms.base.load.model.RoutingType;


@Getter
@Setter
public class LoadDTO {

    private UUID id;

    @Size(max = 50)
    private String loadNumber;

    private UUID brokerId;

    private UUID shipperId;

    private UUID carrierId;

    @NotNull
    private LoadStatus status;

    @Size(max = 500)
    private String originAddress;

    @Size(max = 100)
    private String originCity;

    @Size(max = 50)
    private String originState;

    @Size(max = 20)
    private String originZip;

    @Digits(integer = 10, fraction = 6)
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    @Schema(type = "string", example = "79.0008")
    private BigDecimal originLat;

    @Digits(integer = 10, fraction = 6)
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    @Schema(type = "string", example = "89.0008")
    private BigDecimal originLng;

    @Size(max = 500)
    private String destinationAddress;

    @Size(max = 100)
    private String destinationCity;

    @Size(max = 50)
    private String destinationState;

    @Size(max = 20)
    private String destinationZip;

    @Digits(integer = 10, fraction = 6)
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    @Schema(type = "string", example = "25.0008")
    private BigDecimal destinationLat;

    @Digits(integer = 10, fraction = 6)
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    @Schema(type = "string", example = "15.0008")
    private BigDecimal destinationLng;

    private Integer distance;

    @Size(max = 255)
    private String commodity;

    private Integer weight;

    private EquipmentType equipmentType;

    private RoutingType routingType;

    @Digits(integer = 10, fraction = 2)
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    @Schema(type = "string", example = "92.08")
    private BigDecimal rate;

    @Digits(integer = 10, fraction = 2)
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    @Schema(type = "string", example = "88.08")
    private BigDecimal carrierRate;

    private LocalDate pickupDate;

    @Schema(type = "string", example = "18:30")
    private LocalTime pickupTimeStart;

    @Schema(type = "string", example = "18:30")
    private LocalTime pickupTimeEnd;

    private LocalDate deliveryDate;

    @Schema(type = "string", example = "18:30")
    private LocalTime deliveryTimeStart;

    @Schema(type = "string", example = "18:30")
    private LocalTime deliveryTimeEnd;

    private String notes;

    private String specialInstructions;

    @Size(max = 100)
    private String referenceNumber;

    private Boolean postedToLoadboards;

    private UUID createdBy;

    private UUID assignedDispatcher;

    private UUID assignedDriverId;

    private OffsetDateTime createdAt;

    private OffsetDateTime updatedAt;

}
