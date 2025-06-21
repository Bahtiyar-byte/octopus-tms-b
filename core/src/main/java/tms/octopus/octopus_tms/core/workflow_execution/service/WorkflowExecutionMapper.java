package tms.octopus.octopus_tms.core.workflow_execution.service;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;
import tms.octopus.octopus_tms.core.workflow_execution.domain.WorkflowExecution;
import tms.octopus.octopus_tms.core.workflow_execution.model.WorkflowExecutionDTO;


@Mapper(
        componentModel = MappingConstants.ComponentModel.SPRING,
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface WorkflowExecutionMapper {

    WorkflowExecutionDTO updateWorkflowExecutionDTO(WorkflowExecution workflowExecution,
            @MappingTarget WorkflowExecutionDTO workflowExecutionDTO);

    @Mapping(target = "id", ignore = true)
    WorkflowExecution updateWorkflowExecution(WorkflowExecutionDTO workflowExecutionDTO,
            @MappingTarget WorkflowExecution workflowExecution);

}
