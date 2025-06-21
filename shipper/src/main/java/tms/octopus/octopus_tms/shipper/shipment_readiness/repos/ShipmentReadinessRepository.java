package tms.octopus.octopus_tms.shipper.shipment_readiness.repos;

import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import tms.octopus.octopus_tms.shipper.shipment_readiness.domain.ShipmentReadiness;


public interface ShipmentReadinessRepository extends JpaRepository<ShipmentReadiness, UUID> {

    Page<ShipmentReadiness> findAllById(UUID id, Pageable pageable);

}
