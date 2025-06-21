package tms.octopus.octopus_tms.load.load_tracking.service;

import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import tms.octopus.octopus_tms.load.load_tracking.model.LoadTrackingDTO;


public interface LoadTrackingService {

    Page<LoadTrackingDTO> findAll(Pageable pageable);

    LoadTrackingDTO get(UUID id);

    UUID create(LoadTrackingDTO loadTrackingDTO);

    void update(UUID id, LoadTrackingDTO loadTrackingDTO);

    void delete(UUID id);

}
