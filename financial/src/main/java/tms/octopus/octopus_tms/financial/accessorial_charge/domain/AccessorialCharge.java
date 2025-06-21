package tms.octopus.octopus_tms.financial.accessorial_charge.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;
import tms.octopus.octopus_tms.base.accessorial_charge.model.AccessorialType;


@Entity
@Table(name = "AccessorialCharges")
@Getter
@Setter
public class AccessorialCharge {

    @Id
    @Column(nullable = false, updatable = false)
    @GeneratedValue
    @UuidGenerator
    private UUID id;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private AccessorialType chargeType;

    @Column(columnDefinition = "text")
    private String description;

    @Column(precision = 10, scale = 2)
    private BigDecimal quantity;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal rate;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(nullable = false, length = 50)
    private String billableTo;

    @Column(length = 50)
    private String status;

    @Column
    private OffsetDateTime approvedAt;

    @Column(length = 500)
    private String receiptUrl;

    @Column(columnDefinition = "text")
    private String notes;

    @Column
    private OffsetDateTime createdAt;

}
