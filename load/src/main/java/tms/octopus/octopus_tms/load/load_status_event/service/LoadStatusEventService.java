package tms.octopus.octopus_tms.load.load_status_event.service;

import java.util.List;
import java.util.UUID;
import tms.octopus.octopus_tms.load.load_status_event.model.LoadStatusEventDTO;


public interface LoadStatusEventService {

    List<LoadStatusEventDTO> findAll();

    LoadStatusEventDTO get(UUID id);

    UUID create(LoadStatusEventDTO loadStatusEventDTO);

    void update(UUID id, LoadStatusEventDTO loadStatusEventDTO);

    void delete(UUID id);

}
