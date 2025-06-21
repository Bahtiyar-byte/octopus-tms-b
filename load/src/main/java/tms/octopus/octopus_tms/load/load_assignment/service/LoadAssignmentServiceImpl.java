package tms.octopus.octopus_tms.load.load_assignment.service;

import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import tms.octopus.octopus_tms.base.util.NotFoundException;
import tms.octopus.octopus_tms.load.load_assignment.domain.LoadAssignment;
import tms.octopus.octopus_tms.load.load_assignment.model.LoadAssignmentDTO;
import tms.octopus.octopus_tms.load.load_assignment.repos.LoadAssignmentRepository;


@Service
public class LoadAssignmentServiceImpl implements LoadAssignmentService {

    private final LoadAssignmentRepository loadAssignmentRepository;
    private final LoadAssignmentMapper loadAssignmentMapper;

    public LoadAssignmentServiceImpl(final LoadAssignmentRepository loadAssignmentRepository,
            final LoadAssignmentMapper loadAssignmentMapper) {
        this.loadAssignmentRepository = loadAssignmentRepository;
        this.loadAssignmentMapper = loadAssignmentMapper;
    }

    @Override
    public List<LoadAssignmentDTO> findAll() {
        final List<LoadAssignment> loadAssignments = loadAssignmentRepository.findAll(Sort.by("id"));
        return loadAssignments.stream()
                .map(loadAssignment -> loadAssignmentMapper.updateLoadAssignmentDTO(loadAssignment, new LoadAssignmentDTO()))
                .toList();
    }

    @Override
    public LoadAssignmentDTO get(final UUID id) {
        return loadAssignmentRepository.findById(id)
                .map(loadAssignment -> loadAssignmentMapper.updateLoadAssignmentDTO(loadAssignment, new LoadAssignmentDTO()))
                .orElseThrow(NotFoundException::new);
    }

    @Override
    public UUID create(final LoadAssignmentDTO loadAssignmentDTO) {
        final LoadAssignment loadAssignment = new LoadAssignment();
        loadAssignmentMapper.updateLoadAssignment(loadAssignmentDTO, loadAssignment);
        return loadAssignmentRepository.save(loadAssignment).getId();
    }

    @Override
    public void update(final UUID id, final LoadAssignmentDTO loadAssignmentDTO) {
        final LoadAssignment loadAssignment = loadAssignmentRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        loadAssignmentMapper.updateLoadAssignment(loadAssignmentDTO, loadAssignment);
        loadAssignmentRepository.save(loadAssignment);
    }

    @Override
    public void delete(final UUID id) {
        loadAssignmentRepository.deleteById(id);
    }

}
