package tms.octopus.octopus_tms.load.load_stop.service;

import java.util.List;
import java.util.UUID;
import tms.octopus.octopus_tms.base.util.ReferencedWarning;
import tms.octopus.octopus_tms.load.load_stop.model.LoadStopDTO;


public interface LoadStopService {

    List<LoadStopDTO> findAll();

    LoadStopDTO get(UUID id);

    UUID create(LoadStopDTO loadStopDTO);

    void update(UUID id, LoadStopDTO loadStopDTO);

    void delete(UUID id);

    ReferencedWarning getReferencedWarning(UUID id);

}
