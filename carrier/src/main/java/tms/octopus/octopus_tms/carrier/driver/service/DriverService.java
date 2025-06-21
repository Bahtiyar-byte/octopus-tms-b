package tms.octopus.octopus_tms.carrier.driver.service;

import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import tms.octopus.octopus_tms.base.util.ReferencedWarning;
import tms.octopus.octopus_tms.carrier.driver.model.DriverDTO;


public interface DriverService {

    Page<DriverDTO> findAll(String filter, Pageable pageable);

    DriverDTO get(UUID id);

    UUID create(DriverDTO driverDTO);

    void update(UUID id, DriverDTO driverDTO);

    void delete(UUID id);

    ReferencedWarning getReferencedWarning(UUID id);

}
