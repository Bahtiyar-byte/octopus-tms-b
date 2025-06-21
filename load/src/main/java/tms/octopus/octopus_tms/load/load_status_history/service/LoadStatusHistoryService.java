package tms.octopus.octopus_tms.load.load_status_history.service;

import java.util.List;
import java.util.UUID;
import tms.octopus.octopus_tms.load.load_status_history.model.LoadStatusHistoryDTO;


public interface LoadStatusHistoryService {

    List<LoadStatusHistoryDTO> findAll();

    LoadStatusHistoryDTO get(UUID id);

    UUID create(LoadStatusHistoryDTO loadStatusHistoryDTO);

    void update(UUID id, LoadStatusHistoryDTO loadStatusHistoryDTO);

    void delete(UUID id);

}
