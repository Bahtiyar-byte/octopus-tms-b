package tms.octopus.octopus_tms.load.load_operations.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;
import tms.octopus.octopus_tms.base.load.model.EquipmentType;


@Getter
@Setter
public class LoadQuoteRequestDTO {

    @NotNull
    private UUID loadId;

    @NotNull
    @Size(max = 100)
    private String originCity;

    @NotNull
    @Size(max = 50)
    private String originState;

    @NotNull
    @Size(max = 10)
    private String destinationCity;

    @NotNull
    @Size(max = 50)
    private String destinationState;

    @NotNull
    private LocalDate pickupDate;

    @NotNull
    private LocalDate deliveryDate;

    @NotNull
    @Size(max = 255)
    private String commodity;

    @NotNull
    private Integer weight;

    @NotNull
    private EquipmentType equipmentType;

    @Size(max = 1000)
    private String specialRequirements;

}
