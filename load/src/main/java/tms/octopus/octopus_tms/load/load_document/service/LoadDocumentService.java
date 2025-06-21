package tms.octopus.octopus_tms.load.load_document.service;

import java.util.List;
import java.util.UUID;
import tms.octopus.octopus_tms.load.load_document.model.LoadDocumentDTO;


public interface LoadDocumentService {

    List<LoadDocumentDTO> findAll(String filter);

    LoadDocumentDTO get(UUID id);

    UUID create(LoadDocumentDTO loadDocumentDTO);

    void update(UUID id, LoadDocumentDTO loadDocumentDTO);

    void delete(UUID id);

}
