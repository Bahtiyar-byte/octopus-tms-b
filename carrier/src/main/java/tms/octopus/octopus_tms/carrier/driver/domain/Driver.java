package tms.octopus.octopus_tms.carrier.driver.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;
import tms.octopus.octopus_tms.carrier.driver_performance.domain.DriverPerformance;


@Entity
@Table(name = "Drivers")
@Getter
@Setter
public class Driver {

    @Id
    @Column(nullable = false, updatable = false)
    @GeneratedValue
    @UuidGenerator
    private UUID id;

    @Column
    private UUID companyId;

    @Column
    private UUID userId;

    @Column(length = 50)
    private String driverCode;

    @Column(length = 50)
    private String cdlNumber;

    @Column(length = 50)
    private String cdlState;

    @Column
    private LocalDate cdlExpiration;

    @Column
    private LocalDate medicalCertExpiration;

    @Column
    private Boolean hazmatEndorsed;

    @Column
    private Boolean tankerEndorsed;

    @Column
    private Boolean doublesEndorsed;

    @Column(length = 50)
    private String assignedTruck;

    @Column(length = 100)
    private String homeTerminal;

    @Column(length = 50)
    private String status;

    @Column
    private LocalDate hireDate;

    @Column
    private LocalDate terminationDate;

    @Column
    private String emergencyContactName;

    @Column(length = 50)
    private String emergencyContactPhone;

    @Column
    private OffsetDateTime createdAt;

    @Column
    private OffsetDateTime updatedAt;

    @OneToMany(mappedBy = "driver")
    private Set<DriverPerformance> driverPerformances = new HashSet<>();

}
