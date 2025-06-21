package tms.octopus.octopus_tms.shipper.inventory_movement.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.OffsetDateTime;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class InventoryMovementDTO {

    private UUID id;

    private UUID itemId;

    @NotNull
    @Size(max = 50)
    private String movementType;

    @NotNull
    private Integer quantity;

    @Size(max = 255)
    private String fromLocation;

    @Size(max = 255)
    private String toLocation;

    @Size(max = 50)
    private String referenceType;

    private UUID referenceId;

    private String notes;

    private UUID createdBy;

    private OffsetDateTime createdAt;

    @NotNull
    private UUID inventoryItem;

    @NotNull
    private UUID warehouse;

}
