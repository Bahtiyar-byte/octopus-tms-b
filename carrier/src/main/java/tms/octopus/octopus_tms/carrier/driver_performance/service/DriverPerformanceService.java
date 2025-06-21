package tms.octopus.octopus_tms.carrier.driver_performance.service;

import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import tms.octopus.octopus_tms.carrier.driver_performance.model.DriverPerformanceDTO;


public interface DriverPerformanceService {

    Page<DriverPerformanceDTO> findAll(Pageable pageable);

    DriverPerformanceDTO get(UUID id);

    UUID create(DriverPerformanceDTO driverPerformanceDTO);

    void update(UUID id, DriverPerformanceDTO driverPerformanceDTO);

    void delete(UUID id);

}
