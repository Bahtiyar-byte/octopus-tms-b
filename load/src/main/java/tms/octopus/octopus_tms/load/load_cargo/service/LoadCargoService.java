package tms.octopus.octopus_tms.load.load_cargo.service;

import java.util.List;
import java.util.UUID;
import tms.octopus.octopus_tms.load.load_cargo.model.LoadCargoDTO;


public interface LoadCargoService {

    List<LoadCargoDTO> findAll();

    LoadCargoDTO get(UUID id);

    UUID create(LoadCargoDTO loadCargoDTO);

    void update(UUID id, LoadCargoDTO loadCargoDTO);

    void delete(UUID id);

}
