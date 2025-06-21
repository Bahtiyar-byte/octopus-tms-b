package tms.octopus.octopus_tms.shipper.inventory_movement.repos;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import tms.octopus.octopus_tms.shipper.inventory_item.domain.InventoryItem;
import tms.octopus.octopus_tms.shipper.inventory_movement.domain.InventoryMovement;
import tms.octopus.octopus_tms.shipper.warehouse.domain.Warehouse;


public interface InventoryMovementRepository extends JpaRepository<InventoryMovement, UUID> {

    InventoryMovement findFirstByInventoryItem(InventoryItem inventoryItem);

    InventoryMovement findFirstByWarehouse(Warehouse warehouse);

}
