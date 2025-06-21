package tms.octopus.octopus_tms.core.audit_log.service;

import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import tms.octopus.octopus_tms.base.util.NotFoundException;
import tms.octopus.octopus_tms.core.audit_log.domain.AuditLog;
import tms.octopus.octopus_tms.core.audit_log.model.AuditLogDTO;
import tms.octopus.octopus_tms.core.audit_log.repos.AuditLogRepository;


@Service
public class AuditLogServiceImpl implements AuditLogService {

    private final AuditLogRepository auditLogRepository;
    private final AuditLogMapper auditLogMapper;

    public AuditLogServiceImpl(final AuditLogRepository auditLogRepository,
            final AuditLogMapper auditLogMapper) {
        this.auditLogRepository = auditLogRepository;
        this.auditLogMapper = auditLogMapper;
    }

    @Override
    public Page<AuditLogDTO> findAll(final String filter, final Pageable pageable) {
        Page<AuditLog> page;
        if (filter != null) {
            UUID uuidFilter = null;
            try {
                uuidFilter = UUID.fromString(filter);
            } catch (final IllegalArgumentException illegalArgumentException) {
                // keep null - no parseable input
            }
            page = auditLogRepository.findAllById(uuidFilter, pageable);
        } else {
            page = auditLogRepository.findAll(pageable);
        }
        return new PageImpl<>(page.getContent()
                .stream()
                .map(auditLog -> auditLogMapper.updateAuditLogDTO(auditLog, new AuditLogDTO()))
                .toList(),
                pageable, page.getTotalElements());
    }

    @Override
    public AuditLogDTO get(final UUID id) {
        return auditLogRepository.findById(id)
                .map(auditLog -> auditLogMapper.updateAuditLogDTO(auditLog, new AuditLogDTO()))
                .orElseThrow(NotFoundException::new);
    }

    @Override
    public UUID create(final AuditLogDTO auditLogDTO) {
        final AuditLog auditLog = new AuditLog();
        auditLogMapper.updateAuditLog(auditLogDTO, auditLog);
        return auditLogRepository.save(auditLog).getId();
    }

    @Override
    public void update(final UUID id, final AuditLogDTO auditLogDTO) {
        final AuditLog auditLog = auditLogRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        auditLogMapper.updateAuditLog(auditLogDTO, auditLog);
        auditLogRepository.save(auditLog);
    }

    @Override
    public void delete(final UUID id) {
        auditLogRepository.deleteById(id);
    }

}
