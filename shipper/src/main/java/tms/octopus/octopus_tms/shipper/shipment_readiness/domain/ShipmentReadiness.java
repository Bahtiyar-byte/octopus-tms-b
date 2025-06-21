package tms.octopus.octopus_tms.shipper.shipment_readiness.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;


@Entity
@Table(name = "ShipmentReadinesses")
@Getter
@Setter
public class ShipmentReadiness {

    @Id
    @Column(nullable = false, updatable = false)
    @GeneratedValue
    @UuidGenerator
    private UUID id;

    @Column
    private UUID warehouseId;

    @Column(length = 100)
    private String orderNumber;

    @Column
    private UUID customerId;

    @Column(length = 50)
    private String status;

    @Column(length = 50)
    private String priority;

    @Column
    private LocalDate requiredDate;

    @Column(columnDefinition = "text")
    private String specialInstructions;

    @Column
    private Integer totalItems;

    @Column
    private Integer pickedItems;

    @Column
    private Integer packedItems;

    @Column
    private UUID createdBy;

    @Column
    private OffsetDateTime createdAt;

    @Column
    private OffsetDateTime updatedAt;

}
