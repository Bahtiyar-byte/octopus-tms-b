package tms.octopus.octopus_tms.core.audit_log.repos;

import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import tms.octopus.octopus_tms.core.audit_log.domain.AuditLog;


public interface AuditLogRepository extends JpaRepository<AuditLog, UUID> {

    Page<AuditLog> findAllById(UUID id, Pageable pageable);

}
