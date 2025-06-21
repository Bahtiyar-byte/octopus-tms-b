package tms.octopus.octopus_tms.shipper.warehouse.repos;

import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import tms.octopus.octopus_tms.shipper.warehouse.domain.Warehouse;


public interface WarehouseRepository extends JpaRepository<Warehouse, UUID> {

    Page<Warehouse> findAllById(UUID id, Pageable pageable);

}
