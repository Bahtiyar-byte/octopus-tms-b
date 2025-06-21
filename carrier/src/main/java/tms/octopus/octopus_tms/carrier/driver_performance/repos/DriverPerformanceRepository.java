package tms.octopus.octopus_tms.carrier.driver_performance.repos;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import tms.octopus.octopus_tms.carrier.driver.domain.Driver;
import tms.octopus.octopus_tms.carrier.driver_performance.domain.DriverPerformance;


public interface DriverPerformanceRepository extends JpaRepository<DriverPerformance, UUID> {

    DriverPerformance findFirstByDriver(Driver driver);

}
