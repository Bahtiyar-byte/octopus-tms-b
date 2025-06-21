package tms.octopus.octopus_tms.core.workflow.service;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;
import tms.octopus.octopus_tms.core.workflow.domain.Workflow;
import tms.octopus.octopus_tms.core.workflow.model.WorkflowDTO;


@Mapper(
        componentModel = MappingConstants.ComponentModel.SPRING,
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface WorkflowMapper {

    WorkflowDTO updateWorkflowDTO(Workflow workflow, @MappingTarget WorkflowDTO workflowDTO);

    @Mapping(target = "id", ignore = true)
    Workflow updateWorkflow(WorkflowDTO workflowDTO, @MappingTarget Workflow workflow);

}
