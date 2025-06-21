package tms.octopus.octopus_tms.load.load_operations.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;
import tms.octopus.octopus_tms.base.load.model.EquipmentType;
import tms.octopus.octopus_tms.base.load.model.LoadStatus;


@Getter
@Setter
public class LoadSearchDTO {

    @NotNull
    private UUID id;

    @NotNull
    @Size(max = 50)
    private String loadNumber;

    @NotNull
    private LoadStatus status;

    @NotNull
    @Size(max = 100)
    private String originCity;

    @NotNull
    @Size(max = 50)
    private String originState;

    @NotNull
    @Size(max = 100)
    private String destinationCity;

    @NotNull
    @Size(max = 50)
    private String destinationState;

    private LocalDate pickupDate;

    private LocalDate deliveryDate;

    @Digits(integer = 10, fraction = 2)
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    @Schema(type = "string", example = "92.08")
    private BigDecimal rate;

    @Size(max = 255)
    private String carrierName;

    private EquipmentType equipmentType;

}
