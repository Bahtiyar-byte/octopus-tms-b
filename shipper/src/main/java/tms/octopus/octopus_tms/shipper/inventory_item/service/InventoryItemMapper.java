package tms.octopus.octopus_tms.shipper.inventory_item.service;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;
import tms.octopus.octopus_tms.shipper.inventory_item.domain.InventoryItem;
import tms.octopus.octopus_tms.shipper.inventory_item.model.InventoryItemDTO;


@Mapper(
        componentModel = MappingConstants.ComponentModel.SPRING,
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface InventoryItemMapper {

    InventoryItemDTO updateInventoryItemDTO(InventoryItem inventoryItem,
            @MappingTarget InventoryItemDTO inventoryItemDTO);

    @Mapping(target = "id", ignore = true)
    InventoryItem updateInventoryItem(InventoryItemDTO inventoryItemDTO,
            @MappingTarget InventoryItem inventoryItem);

}
