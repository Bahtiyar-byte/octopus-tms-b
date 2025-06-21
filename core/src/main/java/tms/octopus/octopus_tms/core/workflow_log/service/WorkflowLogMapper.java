package tms.octopus.octopus_tms.core.workflow_log.service;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;
import tms.octopus.octopus_tms.core.workflow_log.domain.WorkflowLog;
import tms.octopus.octopus_tms.core.workflow_log.model.WorkflowLogDTO;


@Mapper(
        componentModel = MappingConstants.ComponentModel.SPRING,
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface WorkflowLogMapper {

    WorkflowLogDTO updateWorkflowLogDTO(WorkflowLog workflowLog,
            @MappingTarget WorkflowLogDTO workflowLogDTO);

    @Mapping(target = "id", ignore = true)
    WorkflowLog updateWorkflowLog(WorkflowLogDTO workflowLogDTO,
            @MappingTarget WorkflowLog workflowLog);

}
