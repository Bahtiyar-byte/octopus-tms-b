package tms.octopus.octopus_tms.load.load_cargo.repos;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import tms.octopus.octopus_tms.load.load.domain.Load;
import tms.octopus.octopus_tms.load.load_cargo.domain.LoadCargo;
import tms.octopus.octopus_tms.load.load_stop.domain.LoadStop;


public interface LoadCargoRepository extends JpaRepository<LoadCargo, UUID> {

    LoadCargo findFirstByLoad(Load load);

    LoadCargo findFirstByPickupStop(LoadStop loadStop);

    LoadCargo findFirstByDeliveryStop(LoadStop loadStop);

}
