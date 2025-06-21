package tms.octopus.octopus_tms.carrier.driver_performance.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;
import tms.octopus.octopus_tms.carrier.driver.domain.Driver;


@Entity
@Table(name = "DriverPerformances")
@Getter
@Setter
public class DriverPerformance {

    @Id
    @Column(nullable = false, updatable = false)
    @GeneratedValue
    @UuidGenerator
    private UUID id;

    @Column(nullable = false)
    private LocalDate periodStart;

    @Column(nullable = false)
    private LocalDate periodEnd;

    @Column
    private Integer milesDriven;

    @Column
    private Integer loadsCompleted;

    @Column(precision = 5, scale = 2)
    private BigDecimal onTimePercentage;

    @Column(precision = 5, scale = 2)
    private BigDecimal safetyScore;

    @Column(precision = 5, scale = 2)
    private BigDecimal fuelEfficiency;

    @Column(precision = 3, scale = 2)
    private BigDecimal customerRating;

    @Column
    private Integer violations;

    @Column
    private Integer accidents;

    @Column
    private OffsetDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "driver_id")
    private Driver driver;

}
