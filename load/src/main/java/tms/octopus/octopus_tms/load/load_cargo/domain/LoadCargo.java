package tms.octopus.octopus_tms.load.load_cargo.domain;

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
import tms.octopus.octopus_tms.load.load_stop.domain.LoadStop;


@Entity
@Table(name = "LoadCargoes")
@Getter
@Setter
public class LoadCargo {

    @Id
    @Column(nullable = false, updatable = false)
    @GeneratedValue
    @UuidGenerator
    private UUID id;

    @Column(nullable = false)
    private String commodity;

    @Column(length = 50)
    private String commodityCode;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal weight;

    @Column(length = 10)
    private String weightUnit;

    @Column
    private Integer pieces;

    @Column
    private Integer palletCount;

    @Column(columnDefinition = "text")
    private String dimensions;

    @Column
    private Boolean hazmat;

    @Column(length = 50)
    private String hazmatClass;

    @Column(length = 10)
    private String unNumber;

    @Column
    private Boolean temperatureControlled;

    @Column(precision = 5, scale = 2)
    private BigDecimal temperatureMin;

    @Column(precision = 5, scale = 2)
    private BigDecimal temperatureMax;

    @Column(length = 10)
    private String temperatureUnit;

    @Column(precision = 12, scale = 2)
    private BigDecimal cargoValue;

    @Column(length = 100)
    private String poNumber;

    @Column(length = 50)
    private String sealNumber;

    @Column(length = 50)
    private String cargoStatus;

    @Column(length = 100)
    private String referenceNumber;

    @Column
    private OffsetDateTime createdAt;

    @Column
    private OffsetDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "load_id", nullable = false)
    private Load load;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pickup_stop_id")
    private LoadStop pickupStop;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "delivery_stop_id")
    private LoadStop deliveryStop;

}
