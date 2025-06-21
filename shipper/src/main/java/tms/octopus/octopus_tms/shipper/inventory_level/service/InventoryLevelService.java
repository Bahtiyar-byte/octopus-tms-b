package tms.octopus.octopus_tms.shipper.inventory_level.service;

import java.util.List;
import java.util.UUID;
import tms.octopus.octopus_tms.shipper.inventory_level.model.InventoryLevelDTO;


public interface InventoryLevelService {

    List<InventoryLevelDTO> findAll();

    InventoryLevelDTO get(UUID id);

    UUID create(InventoryLevelDTO inventoryLevelDTO);

    void update(UUID id, InventoryLevelDTO inventoryLevelDTO);

    void delete(UUID id);

}
