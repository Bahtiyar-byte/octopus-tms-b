package tms.octopus.octopus_tms.load.load_status_event.service;

import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import tms.octopus.octopus_tms.base.util.NotFoundException;
import tms.octopus.octopus_tms.load.load.repos.LoadRepository;
import tms.octopus.octopus_tms.load.load_status_event.domain.LoadStatusEvent;
import tms.octopus.octopus_tms.load.load_status_event.model.LoadStatusEventDTO;
import tms.octopus.octopus_tms.load.load_status_event.repos.LoadStatusEventRepository;


@Service
public class LoadStatusEventServiceImpl implements LoadStatusEventService {

    private final LoadStatusEventRepository loadStatusEventRepository;
    private final LoadRepository loadRepository;
    private final LoadStatusEventMapper loadStatusEventMapper;

    public LoadStatusEventServiceImpl(final LoadStatusEventRepository loadStatusEventRepository,
            final LoadRepository loadRepository,
            final LoadStatusEventMapper loadStatusEventMapper) {
        this.loadStatusEventRepository = loadStatusEventRepository;
        this.loadRepository = loadRepository;
        this.loadStatusEventMapper = loadStatusEventMapper;
    }

    @Override
    public List<LoadStatusEventDTO> findAll() {
        final List<LoadStatusEvent> loadStatusEvents = loadStatusEventRepository.findAll(Sort.by("id"));
        return loadStatusEvents.stream()
                .map(loadStatusEvent -> loadStatusEventMapper.updateLoadStatusEventDTO(loadStatusEvent, new LoadStatusEventDTO()))
                .toList();
    }

    @Override
    public LoadStatusEventDTO get(final UUID id) {
        return loadStatusEventRepository.findById(id)
                .map(loadStatusEvent -> loadStatusEventMapper.updateLoadStatusEventDTO(loadStatusEvent, new LoadStatusEventDTO()))
                .orElseThrow(NotFoundException::new);
    }

    @Override
    public UUID create(final LoadStatusEventDTO loadStatusEventDTO) {
        final LoadStatusEvent loadStatusEvent = new LoadStatusEvent();
        loadStatusEventMapper.updateLoadStatusEvent(loadStatusEventDTO, loadStatusEvent, loadRepository);
        return loadStatusEventRepository.save(loadStatusEvent).getId();
    }

    @Override
    public void update(final UUID id, final LoadStatusEventDTO loadStatusEventDTO) {
        final LoadStatusEvent loadStatusEvent = loadStatusEventRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        loadStatusEventMapper.updateLoadStatusEvent(loadStatusEventDTO, loadStatusEvent, loadRepository);
        loadStatusEventRepository.save(loadStatusEvent);
    }

    @Override
    public void delete(final UUID id) {
        loadStatusEventRepository.deleteById(id);
    }

}
