package tms.octopus.octopus_tms.load.load_stop.repos;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import tms.octopus.octopus_tms.load.load.domain.Load;
import tms.octopus.octopus_tms.load.load_stop.domain.LoadStop;


public interface LoadStopRepository extends JpaRepository<LoadStop, UUID> {

    LoadStop findFirstByLoad(Load load);

}
