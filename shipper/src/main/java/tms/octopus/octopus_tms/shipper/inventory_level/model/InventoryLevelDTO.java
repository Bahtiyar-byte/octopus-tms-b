package tms.octopus.octopus_tms.shipper.inventory_level.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class InventoryLevelDTO {

    private UUID id;

    private UUID itemId;

    @NotNull
    private Integer quantity;

    @NotNull
    private Integer availableQuantity;

    @NotNull
    private Integer reservedQuantity;

    @Size(max = 50)
    private String locationZone;

    @Size(max = 50)
    private String locationAisle;

    @Size(max = 50)
    private String locationRack;

    @Size(max = 50)
    private String locationBin;

    private LocalDate lastCountDate;

    private OffsetDateTime createdAt;

    private OffsetDateTime updatedAt;

    private UUID item;

    @NotNull
    private UUID warehouse;

}
