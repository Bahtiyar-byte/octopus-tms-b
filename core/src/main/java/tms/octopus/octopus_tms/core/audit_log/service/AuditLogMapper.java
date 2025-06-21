package tms.octopus.octopus_tms.core.audit_log.service;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;
import tms.octopus.octopus_tms.core.audit_log.domain.AuditLog;
import tms.octopus.octopus_tms.core.audit_log.model.AuditLogDTO;


@Mapper(
        componentModel = MappingConstants.ComponentModel.SPRING,
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface AuditLogMapper {

    AuditLogDTO updateAuditLogDTO(AuditLog auditLog, @MappingTarget AuditLogDTO auditLogDTO);

    @Mapping(target = "id", ignore = true)
    AuditLog updateAuditLog(AuditLogDTO auditLogDTO, @MappingTarget AuditLog auditLog);

}
