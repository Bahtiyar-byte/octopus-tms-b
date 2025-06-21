package tms.octopus.octopus_tms.core.audit_log.service;

import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import tms.octopus.octopus_tms.core.audit_log.model.AuditLogDTO;


public interface AuditLogService {

    Page<AuditLogDTO> findAll(String filter, Pageable pageable);

    AuditLogDTO get(UUID id);

    UUID create(AuditLogDTO auditLogDTO);

    void update(UUID id, AuditLogDTO auditLogDTO);

    void delete(UUID id);

}
