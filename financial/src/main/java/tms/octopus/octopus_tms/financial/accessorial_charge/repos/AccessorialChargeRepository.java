package tms.octopus.octopus_tms.financial.accessorial_charge.repos;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import tms.octopus.octopus_tms.financial.accessorial_charge.domain.AccessorialCharge;


public interface AccessorialChargeRepository extends JpaRepository<AccessorialCharge, UUID> {
}
