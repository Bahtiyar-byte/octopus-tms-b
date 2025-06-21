package tms.octopus.octopus_tms.load.load_status_event.domain;

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
@Table(name = "LoadStatusEvents")
@Getter
@Setter
public class LoadStatusEvent {

    @Id
    @Column(nullable = false, updatable = false)
    @GeneratedValue
    @UuidGenerator
    private UUID id;

    @Column(nullable = false, length = 100)
    private String eventType;

    @Column(nullable = false)
    private OffsetDateTime eventTimestamp;

    @Column
    private String oldValue;

    @Column
    private String newValue;

    @Column
    private UUID stopId;

    @Column(precision = 10, scale = 6)
    private BigDecimal latitude;

    @Column(precision = 10, scale = 6)
    private BigDecimal longitude;

    @Column(columnDefinition = "text")
    private String notes;

    @Column(columnDefinition = "text")
    private String metadata;

    @Column
    private UUID createdBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "load_id", nullable = false)
    private Load load;

}
