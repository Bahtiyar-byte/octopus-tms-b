package tms.octopus.octopus_tms.load.load.service;

import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import tms.octopus.octopus_tms.base.util.NotFoundException;
import tms.octopus.octopus_tms.base.util.ReferencedWarning;
import tms.octopus.octopus_tms.load.load.domain.Load;
import tms.octopus.octopus_tms.load.load.model.LoadDTO;
import tms.octopus.octopus_tms.load.load.repos.LoadRepository;
import tms.octopus.octopus_tms.load.load_cargo.domain.LoadCargo;
import tms.octopus.octopus_tms.load.load_cargo.repos.LoadCargoRepository;
import tms.octopus.octopus_tms.load.load_document.domain.LoadDocument;
import tms.octopus.octopus_tms.load.load_document.repos.LoadDocumentRepository;
import tms.octopus.octopus_tms.load.load_offer.domain.LoadOffer;
import tms.octopus.octopus_tms.load.load_offer.repos.LoadOfferRepository;
import tms.octopus.octopus_tms.load.load_status_event.domain.LoadStatusEvent;
import tms.octopus.octopus_tms.load.load_status_event.repos.LoadStatusEventRepository;
import tms.octopus.octopus_tms.load.load_stop.domain.LoadStop;
import tms.octopus.octopus_tms.load.load_stop.repos.LoadStopRepository;
import tms.octopus.octopus_tms.load.load_tracking.domain.LoadTracking;
import tms.octopus.octopus_tms.load.load_tracking.repos.LoadTrackingRepository;


@Service
public class LoadServiceImpl implements LoadService {

    private final LoadRepository loadRepository;
    private final LoadMapper loadMapper;
    private final LoadCargoRepository loadCargoRepository;
    private final LoadStopRepository loadStopRepository;
    private final LoadTrackingRepository loadTrackingRepository;
    private final LoadDocumentRepository loadDocumentRepository;
    private final LoadOfferRepository loadOfferRepository;
    private final LoadStatusEventRepository loadStatusEventRepository;

    public LoadServiceImpl(final LoadRepository loadRepository, final LoadMapper loadMapper,
            final LoadCargoRepository loadCargoRepository,
            final LoadStopRepository loadStopRepository,
            final LoadTrackingRepository loadTrackingRepository,
            final LoadDocumentRepository loadDocumentRepository,
            final LoadOfferRepository loadOfferRepository,
            final LoadStatusEventRepository loadStatusEventRepository) {
        this.loadRepository = loadRepository;
        this.loadMapper = loadMapper;
        this.loadCargoRepository = loadCargoRepository;
        this.loadStopRepository = loadStopRepository;
        this.loadTrackingRepository = loadTrackingRepository;
        this.loadDocumentRepository = loadDocumentRepository;
        this.loadOfferRepository = loadOfferRepository;
        this.loadStatusEventRepository = loadStatusEventRepository;
    }

    @Override
    public Page<LoadDTO> findAll(final String filter, final Pageable pageable) {
        Page<Load> page;
        if (filter != null) {
            UUID uuidFilter = null;
            try {
                uuidFilter = UUID.fromString(filter);
            } catch (final IllegalArgumentException illegalArgumentException) {
                // keep null - no parseable input
            }
            page = loadRepository.findAllById(uuidFilter, pageable);
        } else {
            page = loadRepository.findAll(pageable);
        }
        return new PageImpl<>(page.getContent()
                .stream()
                .map(load -> loadMapper.updateLoadDTO(load, new LoadDTO()))
                .toList(),
                pageable, page.getTotalElements());
    }

    @Override
    public LoadDTO get(final UUID id) {
        return loadRepository.findById(id)
                .map(load -> loadMapper.updateLoadDTO(load, new LoadDTO()))
                .orElseThrow(NotFoundException::new);
    }

    @Override
    public UUID create(final LoadDTO loadDTO) {
        final Load load = new Load();
        loadMapper.updateLoad(loadDTO, load);
        return loadRepository.save(load).getId();
    }

    @Override
    public void update(final UUID id, final LoadDTO loadDTO) {
        final Load load = loadRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        loadMapper.updateLoad(loadDTO, load);
        loadRepository.save(load);
    }

    @Override
    public void delete(final UUID id) {
        loadRepository.deleteById(id);
    }

    @Override
    public ReferencedWarning getReferencedWarning(final UUID id) {
        final ReferencedWarning referencedWarning = new ReferencedWarning();
        final Load load = loadRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        final LoadCargo loadLoadCargo = loadCargoRepository.findFirstByLoad(load);
        if (loadLoadCargo != null) {
            referencedWarning.setKey("load.loadCargo.load.referenced");
            referencedWarning.addParam(loadLoadCargo.getId());
            return referencedWarning;
        }
        final LoadStop loadLoadStop = loadStopRepository.findFirstByLoad(load);
        if (loadLoadStop != null) {
            referencedWarning.setKey("load.loadStop.load.referenced");
            referencedWarning.addParam(loadLoadStop.getId());
            return referencedWarning;
        }
        final LoadTracking loadLoadTracking = loadTrackingRepository.findFirstByLoad(load);
        if (loadLoadTracking != null) {
            referencedWarning.setKey("load.loadTracking.load.referenced");
            referencedWarning.addParam(loadLoadTracking.getId());
            return referencedWarning;
        }
        final LoadDocument loadLoadDocument = loadDocumentRepository.findFirstByLoad(load);
        if (loadLoadDocument != null) {
            referencedWarning.setKey("load.loadDocument.load.referenced");
            referencedWarning.addParam(loadLoadDocument.getId());
            return referencedWarning;
        }
        final LoadOffer loadLoadOffer = loadOfferRepository.findFirstByLoad(load);
        if (loadLoadOffer != null) {
            referencedWarning.setKey("load.loadOffer.load.referenced");
            referencedWarning.addParam(loadLoadOffer.getId());
            return referencedWarning;
        }
        final LoadStatusEvent loadLoadStatusEvent = loadStatusEventRepository.findFirstByLoad(load);
        if (loadLoadStatusEvent != null) {
            referencedWarning.setKey("load.loadStatusEvent.load.referenced");
            referencedWarning.addParam(loadLoadStatusEvent.getId());
            return referencedWarning;
        }
        return null;
    }

}
