package tms.octopus.octopus_tms.shipper.warehouse.service;

import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import tms.octopus.octopus_tms.base.util.ReferencedWarning;
import tms.octopus.octopus_tms.shipper.warehouse.model.WarehouseDTO;


public interface WarehouseService {

    Page<WarehouseDTO> findAll(String filter, Pageable pageable);

    WarehouseDTO get(UUID id);

    UUID create(WarehouseDTO warehouseDTO);

    void update(UUID id, WarehouseDTO warehouseDTO);

    void delete(UUID id);

    ReferencedWarning getReferencedWarning(UUID id);

}
