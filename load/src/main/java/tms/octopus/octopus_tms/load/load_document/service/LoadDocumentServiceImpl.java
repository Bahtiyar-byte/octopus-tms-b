package tms.octopus.octopus_tms.load.load_document.service;

import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import tms.octopus.octopus_tms.base.util.NotFoundException;
import tms.octopus.octopus_tms.load.load.repos.LoadRepository;
import tms.octopus.octopus_tms.load.load_document.domain.LoadDocument;
import tms.octopus.octopus_tms.load.load_document.model.LoadDocumentDTO;
import tms.octopus.octopus_tms.load.load_document.repos.LoadDocumentRepository;


@Service
public class LoadDocumentServiceImpl implements LoadDocumentService {

    private final LoadDocumentRepository loadDocumentRepository;
    private final LoadRepository loadRepository;
    private final LoadDocumentMapper loadDocumentMapper;

    public LoadDocumentServiceImpl(final LoadDocumentRepository loadDocumentRepository,
            final LoadRepository loadRepository, final LoadDocumentMapper loadDocumentMapper) {
        this.loadDocumentRepository = loadDocumentRepository;
        this.loadRepository = loadRepository;
        this.loadDocumentMapper = loadDocumentMapper;
    }

    @Override
    public List<LoadDocumentDTO> findAll(final String filter) {
        List<LoadDocument> loadDocuments;
        final Sort sort = Sort.by("id");
        if (filter != null) {
            UUID uuidFilter = null;
            try {
                uuidFilter = UUID.fromString(filter);
            } catch (final IllegalArgumentException illegalArgumentException) {
                // keep null - no parseable input
            }
            loadDocuments = loadDocumentRepository.findAllById(uuidFilter, sort);
        } else {
            loadDocuments = loadDocumentRepository.findAll(sort);
        }
        return loadDocuments.stream()
                .map(loadDocument -> loadDocumentMapper.updateLoadDocumentDTO(loadDocument, new LoadDocumentDTO()))
                .toList();
    }

    @Override
    public LoadDocumentDTO get(final UUID id) {
        return loadDocumentRepository.findById(id)
                .map(loadDocument -> loadDocumentMapper.updateLoadDocumentDTO(loadDocument, new LoadDocumentDTO()))
                .orElseThrow(NotFoundException::new);
    }

    @Override
    public UUID create(final LoadDocumentDTO loadDocumentDTO) {
        final LoadDocument loadDocument = new LoadDocument();
        loadDocumentMapper.updateLoadDocument(loadDocumentDTO, loadDocument, loadRepository);
        return loadDocumentRepository.save(loadDocument).getId();
    }

    @Override
    public void update(final UUID id, final LoadDocumentDTO loadDocumentDTO) {
        final LoadDocument loadDocument = loadDocumentRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        loadDocumentMapper.updateLoadDocument(loadDocumentDTO, loadDocument, loadRepository);
        loadDocumentRepository.save(loadDocument);
    }

    @Override
    public void delete(final UUID id) {
        loadDocumentRepository.deleteById(id);
    }

}
