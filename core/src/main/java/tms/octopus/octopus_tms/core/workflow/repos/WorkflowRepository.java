package tms.octopus.octopus_tms.core.workflow.repos;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import tms.octopus.octopus_tms.core.workflow.domain.Workflow;


public interface WorkflowRepository extends JpaRepository<Workflow, UUID> {
}
