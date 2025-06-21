package tms.octopus.octopus_tms.load.load.service;

import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import tms.octopus.octopus_tms.base.util.ReferencedWarning;
import tms.octopus.octopus_tms.load.load.model.LoadDTO;


public interface LoadService {

    Page<LoadDTO> findAll(String filter, Pageable pageable);

    LoadDTO get(UUID id);

    UUID create(LoadDTO loadDTO);

    void update(UUID id, LoadDTO loadDTO);

    void delete(UUID id);

    ReferencedWarning getReferencedWarning(UUID id);

}
