package tms.octopus.octopus_tms.shipper.inventory_movement.service;

import org.mapstruct.AfterMapping;
import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;
import tms.octopus.octopus_tms.base.util.NotFoundException;
import tms.octopus.octopus_tms.shipper.inventory_item.domain.InventoryItem;
import tms.octopus.octopus_tms.shipper.inventory_item.repos.InventoryItemRepository;
import tms.octopus.octopus_tms.shipper.inventory_movement.domain.InventoryMovement;
import tms.octopus.octopus_tms.shipper.inventory_movement.model.InventoryMovementDTO;
import tms.octopus.octopus_tms.shipper.warehouse.domain.Warehouse;
import tms.octopus.octopus_tms.shipper.warehouse.repos.WarehouseRepository;


@Mapper(
        componentModel = MappingConstants.ComponentModel.SPRING,
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface InventoryMovementMapper {

    @Mapping(target = "inventoryItem", ignore = true)
    @Mapping(target = "warehouse", ignore = true)
    InventoryMovementDTO updateInventoryMovementDTO(InventoryMovement inventoryMovement,
            @MappingTarget InventoryMovementDTO inventoryMovementDTO);

    @AfterMapping
    default void afterUpdateInventoryMovementDTO(InventoryMovement inventoryMovement,
            @MappingTarget InventoryMovementDTO inventoryMovementDTO) {
        inventoryMovementDTO.setInventoryItem(inventoryMovement.getInventoryItem() == null ? null : inventoryMovement.getInventoryItem().getId());
        inventoryMovementDTO.setWarehouse(inventoryMovement.getWarehouse() == null ? null : inventoryMovement.getWarehouse().getId());
    }

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "inventoryItem", ignore = true)
    @Mapping(target = "warehouse", ignore = true)
    InventoryMovement updateInventoryMovement(InventoryMovementDTO inventoryMovementDTO,
            @MappingTarget InventoryMovement inventoryMovement,
            @Context InventoryItemRepository inventoryItemRepository,
            @Context WarehouseRepository warehouseRepository);

    @AfterMapping
    default void afterUpdateInventoryMovement(InventoryMovementDTO inventoryMovementDTO,
            @MappingTarget InventoryMovement inventoryMovement,
            @Context InventoryItemRepository inventoryItemRepository,
            @Context WarehouseRepository warehouseRepository) {
        final InventoryItem inventoryItem = inventoryMovementDTO.getInventoryItem() == null ? null : inventoryItemRepository.findById(inventoryMovementDTO.getInventoryItem())
                .orElseThrow(() -> new NotFoundException("inventoryItem not found"));
        inventoryMovement.setInventoryItem(inventoryItem);
        final Warehouse warehouse = inventoryMovementDTO.getWarehouse() == null ? null : warehouseRepository.findById(inventoryMovementDTO.getWarehouse())
                .orElseThrow(() -> new NotFoundException("warehouse not found"));
        inventoryMovement.setWarehouse(warehouse);
    }

}
