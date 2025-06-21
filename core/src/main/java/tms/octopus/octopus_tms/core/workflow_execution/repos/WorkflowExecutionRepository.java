package tms.octopus.octopus_tms.core.workflow_execution.repos;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import tms.octopus.octopus_tms.core.workflow_execution.domain.WorkflowExecution;


public interface WorkflowExecutionRepository extends JpaRepository<WorkflowExecution, UUID> {
}
