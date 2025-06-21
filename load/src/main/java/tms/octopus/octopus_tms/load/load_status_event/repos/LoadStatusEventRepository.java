package tms.octopus.octopus_tms.load.load_status_event.repos;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import tms.octopus.octopus_tms.load.load.domain.Load;
import tms.octopus.octopus_tms.load.load_status_event.domain.LoadStatusEvent;


public interface LoadStatusEventRepository extends JpaRepository<LoadStatusEvent, UUID> {

    LoadStatusEvent findFirstByLoad(Load load);

}
