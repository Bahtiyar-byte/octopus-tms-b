package tms.octopus.octopus_tms.shipper.inventory_level.service;

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
import tms.octopus.octopus_tms.shipper.inventory_level.domain.InventoryLevel;
import tms.octopus.octopus_tms.shipper.inventory_level.model.InventoryLevelDTO;
import tms.octopus.octopus_tms.shipper.warehouse.domain.Warehouse;
import tms.octopus.octopus_tms.shipper.warehouse.repos.WarehouseRepository;


@Mapper(
        componentModel = MappingConstants.ComponentModel.SPRING,
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface InventoryLevelMapper {

    @Mapping(target = "item", ignore = true)
    @Mapping(target = "warehouse", ignore = true)
    InventoryLevelDTO updateInventoryLevelDTO(InventoryLevel inventoryLevel,
            @MappingTarget InventoryLevelDTO inventoryLevelDTO);

    @AfterMapping
    default void afterUpdateInventoryLevelDTO(InventoryLevel inventoryLevel,
            @MappingTarget InventoryLevelDTO inventoryLevelDTO) {
        inventoryLevelDTO.setItem(inventoryLevel.getItem() == null ? null : inventoryLevel.getItem().getId());
        inventoryLevelDTO.setWarehouse(inventoryLevel.getWarehouse() == null ? null : inventoryLevel.getWarehouse().getId());
    }

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "item", ignore = true)
    @Mapping(target = "warehouse", ignore = true)
    InventoryLevel updateInventoryLevel(InventoryLevelDTO inventoryLevelDTO,
            @MappingTarget InventoryLevel inventoryLevel,
            @Context InventoryItemRepository inventoryItemRepository,
            @Context WarehouseRepository warehouseRepository);

    @AfterMapping
    default void afterUpdateInventoryLevel(InventoryLevelDTO inventoryLevelDTO,
            @MappingTarget InventoryLevel inventoryLevel,
            @Context InventoryItemRepository inventoryItemRepository,
            @Context WarehouseRepository warehouseRepository) {
        final InventoryItem item = inventoryLevelDTO.getItem() == null ? null : inventoryItemRepository.findById(inventoryLevelDTO.getItem())
                .orElseThrow(() -> new NotFoundException("item not found"));
        inventoryLevel.setItem(item);
        final Warehouse warehouse = inventoryLevelDTO.getWarehouse() == null ? null : warehouseRepository.findById(inventoryLevelDTO.getWarehouse())
                .orElseThrow(() -> new NotFoundException("warehouse not found"));
        inventoryLevel.setWarehouse(warehouse);
    }

}
