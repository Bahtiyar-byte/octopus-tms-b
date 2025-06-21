package tms.octopus.octopus_tms.carrier.driver.repos;

import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import tms.octopus.octopus_tms.carrier.driver.domain.Driver;


public interface DriverRepository extends JpaRepository<Driver, UUID> {

    Page<Driver> findAllById(UUID id, Pageable pageable);

}
