package tms.octopus.octopus_tms.shipper.inventory_movement.service;

import java.util.List;
import java.util.UUID;
import tms.octopus.octopus_tms.shipper.inventory_movement.model.InventoryMovementDTO;


public interface InventoryMovementService {

    List<InventoryMovementDTO> findAll();

    InventoryMovementDTO get(UUID id);

    UUID create(InventoryMovementDTO inventoryMovementDTO);

    void update(UUID id, InventoryMovementDTO inventoryMovementDTO);

    void delete(UUID id);

}
