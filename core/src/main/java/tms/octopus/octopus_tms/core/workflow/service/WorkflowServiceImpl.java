package tms.octopus.octopus_tms.core.workflow.service;

import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import tms.octopus.octopus_tms.base.util.NotFoundException;
import tms.octopus.octopus_tms.core.workflow.domain.Workflow;
import tms.octopus.octopus_tms.core.workflow.model.WorkflowDTO;
import tms.octopus.octopus_tms.core.workflow.repos.WorkflowRepository;


@Service
public class WorkflowServiceImpl implements WorkflowService {

    private final WorkflowRepository workflowRepository;
    private final WorkflowMapper workflowMapper;

    public WorkflowServiceImpl(final WorkflowRepository workflowRepository,
            final WorkflowMapper workflowMapper) {
        this.workflowRepository = workflowRepository;
        this.workflowMapper = workflowMapper;
    }

    @Override
    public List<WorkflowDTO> findAll() {
        final List<Workflow> workflows = workflowRepository.findAll(Sort.by("id"));
        return workflows.stream()
                .map(workflow -> workflowMapper.updateWorkflowDTO(workflow, new WorkflowDTO()))
                .toList();
    }

    @Override
    public WorkflowDTO get(final UUID id) {
        return workflowRepository.findById(id)
                .map(workflow -> workflowMapper.updateWorkflowDTO(workflow, new WorkflowDTO()))
                .orElseThrow(NotFoundException::new);
    }

    @Override
    public UUID create(final WorkflowDTO workflowDTO) {
        final Workflow workflow = new Workflow();
        workflowMapper.updateWorkflow(workflowDTO, workflow);
        return workflowRepository.save(workflow).getId();
    }

    @Override
    public void update(final UUID id, final WorkflowDTO workflowDTO) {
        final Workflow workflow = workflowRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        workflowMapper.updateWorkflow(workflowDTO, workflow);
        workflowRepository.save(workflow);
    }

    @Override
    public void delete(final UUID id) {
        workflowRepository.deleteById(id);
    }

}
