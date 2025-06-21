package tms.octopus.octopus_tms.load.load_assignment.repos;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import tms.octopus.octopus_tms.load.load_assignment.domain.LoadAssignment;


public interface LoadAssignmentRepository extends JpaRepository<LoadAssignment, UUID> {
}
