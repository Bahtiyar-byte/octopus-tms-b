package tms.octopus.octopus_tms.load.load_tracking.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;
import tms.octopus.octopus_tms.load.load.domain.Load;


@Entity
@Table(name = "LoadTrackings")
@Getter
@Setter
public class LoadTracking {

    @Id
    @Column(nullable = false, updatable = false)
    @GeneratedValue
    @UuidGenerator
    private UUID id;

    @Column
    private UUID driverId;

    @Column(precision = 10, scale = 6)
    private BigDecimal latitude;

    @Column(precision = 10, scale = 6)
    private BigDecimal longitude;

    @Column
    private String locationName;

    @Column
    private Integer speed;

    @Column
    private Integer heading;

    @Column
    private Integer odometer;

    @Column
    private Integer engineHours;

    @Column
    private Integer fuelLevel;

    @Column(precision = 5, scale = 2)
    private BigDecimal temperature;

    @Column(length = 50)
    private String status;

    @Column(length = 100)
    private String eventType;

    @Column(columnDefinition = "text")
    private String notes;

    @Column
    private OffsetDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "load_id", nullable = false)
    private Load load;

}
