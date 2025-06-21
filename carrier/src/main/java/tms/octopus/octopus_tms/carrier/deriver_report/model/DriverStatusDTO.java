package tms.octopus.octopus_tms.carrier.deriver_report.model;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;
import tms.octopus.octopus_tms.carrier.driver.model.DriverDTO;
import tms.octopus.octopus_tms.carrier.equipment.model.EquipmentDTO;
import tms.octopus.octopus_tms.load.load.model.LoadDTO;
import tms.octopus.octopus_tms.load.load_tracking.model.LoadTrackingDTO;


@Getter
@Setter
public class DriverStatusDTO {

    @NotNull
    @Valid
    private DriverDTO driver;

    @Valid
    private LoadDTO currentLoad;

    @Valid
    private LoadTrackingDTO currentLocation;

    @Valid
    private EquipmentDTO equipment;

    @NotNull
    private Double hoursAvailable;

    @NotNull
    @Size(max = 50)
    private String currentStatus;

    private LocalDate nextAvailableDate;

}
