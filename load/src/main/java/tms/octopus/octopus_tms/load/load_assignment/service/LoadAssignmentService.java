package tms.octopus.octopus_tms.load.load_assignment.service;

import java.util.List;
import java.util.UUID;
import tms.octopus.octopus_tms.load.load_assignment.model.LoadAssignmentDTO;


public interface LoadAssignmentService {

    List<LoadAssignmentDTO> findAll();

    LoadAssignmentDTO get(UUID id);

    UUID create(LoadAssignmentDTO loadAssignmentDTO);

    void update(UUID id, LoadAssignmentDTO loadAssignmentDTO);

    void delete(UUID id);

}
