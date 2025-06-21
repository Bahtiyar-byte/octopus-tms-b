package tms.octopus.octopus_tms.shipper.inventory_movement.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.OffsetDateTime;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;
import tms.octopus.octopus_tms.shipper.inventory_item.domain.InventoryItem;
import tms.octopus.octopus_tms.shipper.warehouse.domain.Warehouse;


@Entity
@Table(name = "InventoryMovements")
@Getter
@Setter
public class InventoryMovement {

    @Id
    @Column(nullable = false, updatable = false)
    @GeneratedValue
    @UuidGenerator
    private UUID id;

    @Column
    private UUID itemId;

    @Column(nullable = false, length = 50)
    private String movementType;

    @Column(nullable = false)
    private Integer quantity;

    @Column
    private String fromLocation;

    @Column
    private String toLocation;

    @Column(length = 50)
    private String referenceType;

    @Column
    private UUID referenceId;

    @Column(columnDefinition = "text")
    private String notes;

    @Column
    private UUID createdBy;

    @Column
    private OffsetDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "inventory_item_id", nullable = false)
    private InventoryItem inventoryItem;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "warehouse_id", nullable = false)
    private Warehouse warehouse;

}
