package tms.octopus.octopus_tms.shipper.inventory_level.repos;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import tms.octopus.octopus_tms.shipper.inventory_item.domain.InventoryItem;
import tms.octopus.octopus_tms.shipper.inventory_level.domain.InventoryLevel;
import tms.octopus.octopus_tms.shipper.warehouse.domain.Warehouse;


public interface InventoryLevelRepository extends JpaRepository<InventoryLevel, UUID> {

    InventoryLevel findFirstByItem(InventoryItem inventoryItem);

    InventoryLevel findFirstByWarehouse(Warehouse warehouse);

}
