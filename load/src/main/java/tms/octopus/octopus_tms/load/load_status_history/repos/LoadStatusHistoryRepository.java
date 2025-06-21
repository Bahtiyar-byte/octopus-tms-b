package tms.octopus.octopus_tms.load.load_status_history.repos;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import tms.octopus.octopus_tms.load.load_status_history.domain.LoadStatusHistory;


public interface LoadStatusHistoryRepository extends JpaRepository<LoadStatusHistory, UUID> {
}
