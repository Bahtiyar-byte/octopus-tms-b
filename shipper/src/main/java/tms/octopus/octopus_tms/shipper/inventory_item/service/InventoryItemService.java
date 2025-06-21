package tms.octopus.octopus_tms.shipper.inventory_item.service;

import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import tms.octopus.octopus_tms.base.util.ReferencedWarning;
import tms.octopus.octopus_tms.shipper.inventory_item.model.InventoryItemDTO;


public interface InventoryItemService {

    Page<InventoryItemDTO> findAll(String filter, Pageable pageable);

    InventoryItemDTO get(UUID id);

    UUID create(InventoryItemDTO inventoryItemDTO);

    void update(UUID id, InventoryItemDTO inventoryItemDTO);

    void delete(UUID id);

    ReferencedWarning getReferencedWarning(UUID id);

}
