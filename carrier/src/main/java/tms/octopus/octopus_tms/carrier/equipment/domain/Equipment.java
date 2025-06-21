package tms.octopus.octopus_tms.carrier.equipment.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;
import tms.octopus.octopus_tms.base.load.model.EquipmentType;


@Entity
@Table(name = "Equipments")
@Getter
@Setter
public class Equipment {

    @Id
    @Column(nullable = false, updatable = false)
    @GeneratedValue
    @UuidGenerator
    private UUID id;

    @Column(nullable = false)
    private UUID carrierId;

    @Column(nullable = false, length = 50)
    private String equipmentNumber;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private EquipmentType equipmentType;

    @Column
    private Integer year;

    @Column(length = 100)
    private String make;

    @Column(length = 100)
    private String model;

    @Column(length = 50)
    private String vin;

    @Column(length = 50)
    private String licensePlate;

    @Column(length = 2)
    private String licenseState;

    @Column(length = 50)
    private String color;

    @Column(length = 50)
    private String status;

    @Column
    private String currentLocation;

    @Column
    private UUID currentDriverId;

    @Column
    private LocalDate lastInspectionDate;

    @Column
    private LocalDate nextInspectionDue;

    @Column
    private LocalDate registrationExpiry;

    @Column
    private LocalDate insuranceExpiry;

    @Column(length = 100)
    private String eldProvider;

    @Column(length = 100)
    private String eldId;

    @Column(columnDefinition = "text")
    private String notes;

    @Column
    private OffsetDateTime createdAt;

    @Column
    private OffsetDateTime updatedAt;

}
