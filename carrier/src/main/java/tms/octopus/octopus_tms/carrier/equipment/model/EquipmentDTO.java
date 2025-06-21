package tms.octopus.octopus_tms.carrier.equipment.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;
import tms.octopus.octopus_tms.base.load.model.EquipmentType;


@Getter
@Setter
public class EquipmentDTO {

    private UUID id;

    @NotNull
    private UUID carrierId;

    @NotNull
    @Size(max = 50)
    private String equipmentNumber;

    @NotNull
    private EquipmentType equipmentType;

    private Integer year;

    @Size(max = 100)
    private String make;

    @Size(max = 100)
    private String model;

    @Size(max = 50)
    private String vin;

    @Size(max = 50)
    private String licensePlate;

    @Size(max = 2)
    private String licenseState;

    @Size(max = 50)
    private String color;

    @Size(max = 50)
    private String status;

    @Size(max = 255)
    private String currentLocation;

    private UUID currentDriverId;

    private LocalDate lastInspectionDate;

    private LocalDate nextInspectionDue;

    private LocalDate registrationExpiry;

    private LocalDate insuranceExpiry;

    @Size(max = 100)
    private String eldProvider;

    @Size(max = 100)
    private String eldId;

    private String notes;

    private OffsetDateTime createdAt;

    private OffsetDateTime updatedAt;

}
