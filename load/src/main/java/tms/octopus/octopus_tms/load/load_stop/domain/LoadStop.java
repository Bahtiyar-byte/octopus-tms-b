package tms.octopus.octopus_tms.load.load_stop.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;
import tms.octopus.octopus_tms.base.load_stop.model.StopType;
import tms.octopus.octopus_tms.load.load.domain.Load;
import tms.octopus.octopus_tms.load.load_cargo.domain.LoadCargo;


@Entity
@Table(name = "LoadStops")
@Getter
@Setter
public class LoadStop {

    @Id
    @Column(nullable = false, updatable = false)
    @GeneratedValue
    @UuidGenerator
    private UUID id;

    @Column(nullable = false)
    private Integer stopNumber;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private StopType stopType;

    @Column
    private UUID companyId;

    @Column
    private UUID warehouseId;

    @Column
    private String locationName;

    @Column
    private String addressLine1;

    @Column
    private String addressLine2;

    @Column(length = 100)
    private String city;

    @Column(length = 50)
    private String state;

    @Column(length = 20)
    private String zipCode;

    @Column(length = 50)
    private String country;

    @Column(precision = 10, scale = 6)
    private BigDecimal latitude;

    @Column(precision = 10, scale = 6)
    private BigDecimal longitude;

    @Column
    private String contactName;

    @Column(length = 50)
    private String contactPhone;

    @Column
    private String contactEmail;

    @Column
    private LocalDate scheduledDate;

    @Column
    private LocalTime scheduledTimeStart;

    @Column
    private LocalTime scheduledTimeEnd;

    @Column
    private OffsetDateTime actualArrival;

    @Column
    private OffsetDateTime actualDeparture;

    @Column(columnDefinition = "text")
    private String notes;

    @Column(columnDefinition = "text")
    private String specialInstructions;

    @Column
    private OffsetDateTime createdAt;

    @Column
    private OffsetDateTime updatedAt;

    @OneToMany(mappedBy = "pickupStop")
    private Set<LoadCargo> pickupCargoes = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "load_id", nullable = false)
    private Load load;

    @OneToMany(mappedBy = "deliveryStop")
    private Set<LoadCargo> deliveryCargoes = new HashSet<>();

}
