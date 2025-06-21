package tms.octopus.octopus_tms.core.workflow_log.service;

import java.util.List;
import java.util.UUID;
import tms.octopus.octopus_tms.core.workflow_log.model.WorkflowLogDTO;


public interface WorkflowLogService {

    List<WorkflowLogDTO> findAll();

    WorkflowLogDTO get(UUID id);

    UUID create(WorkflowLogDTO workflowLogDTO);

    void update(UUID id, WorkflowLogDTO workflowLogDTO);

    void delete(UUID id);

}
