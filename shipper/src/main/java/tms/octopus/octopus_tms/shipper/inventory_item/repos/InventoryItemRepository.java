package tms.octopus.octopus_tms.shipper.inventory_item.repos;

import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import tms.octopus.octopus_tms.shipper.inventory_item.domain.InventoryItem;


public interface InventoryItemRepository extends JpaRepository<InventoryItem, UUID> {

    Page<InventoryItem> findAllById(UUID id, Pageable pageable);

}
