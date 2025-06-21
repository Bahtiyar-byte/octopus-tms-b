package tms.octopus.octopus_tms.load.load_tracking.service;

import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import tms.octopus.octopus_tms.base.util.NotFoundException;
import tms.octopus.octopus_tms.load.load.repos.LoadRepository;
import tms.octopus.octopus_tms.load.load_tracking.domain.LoadTracking;
import tms.octopus.octopus_tms.load.load_tracking.model.LoadTrackingDTO;
import tms.octopus.octopus_tms.load.load_tracking.repos.LoadTrackingRepository;


@Service
public class LoadTrackingServiceImpl implements LoadTrackingService {

    private final LoadTrackingRepository loadTrackingRepository;
    private final LoadRepository loadRepository;
    private final LoadTrackingMapper loadTrackingMapper;

    public LoadTrackingServiceImpl(final LoadTrackingRepository loadTrackingRepository,
            final LoadRepository loadRepository, final LoadTrackingMapper loadTrackingMapper) {
        this.loadTrackingRepository = loadTrackingRepository;
        this.loadRepository = loadRepository;
        this.loadTrackingMapper = loadTrackingMapper;
    }

    @Override
    public Page<LoadTrackingDTO> findAll(final Pageable pageable) {
        final Page<LoadTracking> page = loadTrackingRepository.findAll(pageable);
        return new PageImpl<>(page.getContent()
                .stream()
                .map(loadTracking -> loadTrackingMapper.updateLoadTrackingDTO(loadTracking, new LoadTrackingDTO()))
                .toList(),
                pageable, page.getTotalElements());
    }

    @Override
    public LoadTrackingDTO get(final UUID id) {
        return loadTrackingRepository.findById(id)
                .map(loadTracking -> loadTrackingMapper.updateLoadTrackingDTO(loadTracking, new LoadTrackingDTO()))
                .orElseThrow(NotFoundException::new);
    }

    @Override
    public UUID create(final LoadTrackingDTO loadTrackingDTO) {
        final LoadTracking loadTracking = new LoadTracking();
        loadTrackingMapper.updateLoadTracking(loadTrackingDTO, loadTracking, loadRepository);
        return loadTrackingRepository.save(loadTracking).getId();
    }

    @Override
    public void update(final UUID id, final LoadTrackingDTO loadTrackingDTO) {
        final LoadTracking loadTracking = loadTrackingRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        loadTrackingMapper.updateLoadTracking(loadTrackingDTO, loadTracking, loadRepository);
        loadTrackingRepository.save(loadTracking);
    }

    @Override
    public void delete(final UUID id) {
        loadTrackingRepository.deleteById(id);
    }

}
