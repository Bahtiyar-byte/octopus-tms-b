package tms.octopus.octopus_tms.core.workflow_log.service;

import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import tms.octopus.octopus_tms.base.util.NotFoundException;
import tms.octopus.octopus_tms.core.workflow_log.domain.WorkflowLog;
import tms.octopus.octopus_tms.core.workflow_log.model.WorkflowLogDTO;
import tms.octopus.octopus_tms.core.workflow_log.repos.WorkflowLogRepository;


@Service
public class WorkflowLogServiceImpl implements WorkflowLogService {

    private final WorkflowLogRepository workflowLogRepository;
    private final WorkflowLogMapper workflowLogMapper;

    public WorkflowLogServiceImpl(final WorkflowLogRepository workflowLogRepository,
            final WorkflowLogMapper workflowLogMapper) {
        this.workflowLogRepository = workflowLogRepository;
        this.workflowLogMapper = workflowLogMapper;
    }

    @Override
    public List<WorkflowLogDTO> findAll() {
        final List<WorkflowLog> workflowLogs = workflowLogRepository.findAll(Sort.by("id"));
        return workflowLogs.stream()
                .map(workflowLog -> workflowLogMapper.updateWorkflowLogDTO(workflowLog, new WorkflowLogDTO()))
                .toList();
    }

    @Override
    public WorkflowLogDTO get(final UUID id) {
        return workflowLogRepository.findById(id)
                .map(workflowLog -> workflowLogMapper.updateWorkflowLogDTO(workflowLog, new WorkflowLogDTO()))
                .orElseThrow(NotFoundException::new);
    }

    @Override
    public UUID create(final WorkflowLogDTO workflowLogDTO) {
        final WorkflowLog workflowLog = new WorkflowLog();
        workflowLogMapper.updateWorkflowLog(workflowLogDTO, workflowLog);
        return workflowLogRepository.save(workflowLog).getId();
    }

    @Override
    public void update(final UUID id, final WorkflowLogDTO workflowLogDTO) {
        final WorkflowLog workflowLog = workflowLogRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        workflowLogMapper.updateWorkflowLog(workflowLogDTO, workflowLog);
        workflowLogRepository.save(workflowLog);
    }

    @Override
    public void delete(final UUID id) {
        workflowLogRepository.deleteById(id);
    }

}
