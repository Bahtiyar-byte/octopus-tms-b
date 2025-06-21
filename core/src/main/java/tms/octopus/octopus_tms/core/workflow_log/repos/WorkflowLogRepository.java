package tms.octopus.octopus_tms.core.workflow_log.repos;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import tms.octopus.octopus_tms.core.workflow_log.domain.WorkflowLog;


public interface WorkflowLogRepository extends JpaRepository<WorkflowLog, UUID> {
}
