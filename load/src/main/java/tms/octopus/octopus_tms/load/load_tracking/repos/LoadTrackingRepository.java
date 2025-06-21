package tms.octopus.octopus_tms.load.load_tracking.repos;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import tms.octopus.octopus_tms.load.load.domain.Load;
import tms.octopus.octopus_tms.load.load_tracking.domain.LoadTracking;


public interface LoadTrackingRepository extends JpaRepository<LoadTracking, UUID> {

    LoadTracking findFirstByLoad(Load load);

}
