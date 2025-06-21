package tms.octopus.octopus_tms.shipper.shipment_readiness.service;

import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import tms.octopus.octopus_tms.shipper.shipment_readiness.model.ShipmentReadinessDTO;


public interface ShipmentReadinessService {

    Page<ShipmentReadinessDTO> findAll(String filter, Pageable pageable);

    ShipmentReadinessDTO get(UUID id);

    UUID create(ShipmentReadinessDTO shipmentReadinessDTO);

    void update(UUID id, ShipmentReadinessDTO shipmentReadinessDTO);

    void delete(UUID id);

}
