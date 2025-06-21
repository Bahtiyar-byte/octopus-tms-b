package tms.octopus.octopus_tms.core.workflow_execution.service;

import java.util.List;
import java.util.UUID;
import tms.octopus.octopus_tms.core.workflow_execution.model.WorkflowExecutionDTO;


public interface WorkflowExecutionService {

    List<WorkflowExecutionDTO> findAll();

    WorkflowExecutionDTO get(UUID id);

    UUID create(WorkflowExecutionDTO workflowExecutionDTO);

    void update(UUID id, WorkflowExecutionDTO workflowExecutionDTO);

    void delete(UUID id);

}
