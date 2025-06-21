package tms.octopus.octopus_tms.core.workflow_execution.service;

import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import tms.octopus.octopus_tms.base.util.NotFoundException;
import tms.octopus.octopus_tms.core.workflow_execution.domain.WorkflowExecution;
import tms.octopus.octopus_tms.core.workflow_execution.model.WorkflowExecutionDTO;
import tms.octopus.octopus_tms.core.workflow_execution.repos.WorkflowExecutionRepository;


@Service
public class WorkflowExecutionServiceImpl implements WorkflowExecutionService {

    private final WorkflowExecutionRepository workflowExecutionRepository;
    private final WorkflowExecutionMapper workflowExecutionMapper;

    public WorkflowExecutionServiceImpl(
            final WorkflowExecutionRepository workflowExecutionRepository,
            final WorkflowExecutionMapper workflowExecutionMapper) {
        this.workflowExecutionRepository = workflowExecutionRepository;
        this.workflowExecutionMapper = workflowExecutionMapper;
    }

    @Override
    public List<WorkflowExecutionDTO> findAll() {
        final List<WorkflowExecution> workflowExecutions = workflowExecutionRepository.findAll(Sort.by("id"));
        return workflowExecutions.stream()
                .map(workflowExecution -> workflowExecutionMapper.updateWorkflowExecutionDTO(workflowExecution, new WorkflowExecutionDTO()))
                .toList();
    }

    @Override
    public WorkflowExecutionDTO get(final UUID id) {
        return workflowExecutionRepository.findById(id)
                .map(workflowExecution -> workflowExecutionMapper.updateWorkflowExecutionDTO(workflowExecution, new WorkflowExecutionDTO()))
                .orElseThrow(NotFoundException::new);
    }

    @Override
    public UUID create(final WorkflowExecutionDTO workflowExecutionDTO) {
        final WorkflowExecution workflowExecution = new WorkflowExecution();
        workflowExecutionMapper.updateWorkflowExecution(workflowExecutionDTO, workflowExecution);
        return workflowExecutionRepository.save(workflowExecution).getId();
    }

    @Override
    public void update(final UUID id, final WorkflowExecutionDTO workflowExecutionDTO) {
        final WorkflowExecution workflowExecution = workflowExecutionRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        workflowExecutionMapper.updateWorkflowExecution(workflowExecutionDTO, workflowExecution);
        workflowExecutionRepository.save(workflowExecution);
    }

    @Override
    public void delete(final UUID id) {
        workflowExecutionRepository.deleteById(id);
    }

}
