package tms.octopus.octopus_tms.core.workflow.service;

import java.util.List;
import java.util.UUID;
import tms.octopus.octopus_tms.core.workflow.model.WorkflowDTO;


public interface WorkflowService {

    List<WorkflowDTO> findAll();

    WorkflowDTO get(UUID id);

    UUID create(WorkflowDTO workflowDTO);

    void update(UUID id, WorkflowDTO workflowDTO);

    void delete(UUID id);

}
