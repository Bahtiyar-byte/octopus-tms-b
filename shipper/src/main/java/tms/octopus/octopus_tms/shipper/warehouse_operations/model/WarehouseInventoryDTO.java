package tms.octopus.octopus_tms.shipper.warehouse_operations.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.List;
import lombok.Getter;
import lombok.Setter;
import tms.octopus.octopus_tms.shipper.inventory_item.model.InventoryItemDTO;
import tms.octopus.octopus_tms.shipper.inventory_movement.model.InventoryMovementDTO;
import tms.octopus.octopus_tms.shipper.shipment_readiness.model.ShipmentReadinessDTO;
import tms.octopus.octopus_tms.shipper.warehouse.model.WarehouseDTO;


@Getter
@Setter
public class WarehouseInventoryDTO {

    @NotNull
    @Valid
    private WarehouseDTO warehouse;

    @NotNull
    private Long totalItems;

    @NotNull
    @Digits(integer = 10, fraction = 2)
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    @Schema(type = "string", example = "31.08")
    private BigDecimal totalValue;

    @NotNull
    private Double utilizationPercent;

    @Valid
    private List<InventoryItemDTO> lowStockItems;

    @Valid
    private List<ShipmentReadinessDTO> pendingShipments;

    @Valid
    private List<InventoryMovementDTO> recentMovements;

}
