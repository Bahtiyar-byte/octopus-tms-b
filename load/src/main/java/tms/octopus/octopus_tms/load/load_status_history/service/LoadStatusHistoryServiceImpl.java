package tms.octopus.octopus_tms.load.load_status_history.service;

import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import tms.octopus.octopus_tms.base.util.NotFoundException;
import tms.octopus.octopus_tms.load.load_status_history.domain.LoadStatusHistory;
import tms.octopus.octopus_tms.load.load_status_history.model.LoadStatusHistoryDTO;
import tms.octopus.octopus_tms.load.load_status_history.repos.LoadStatusHistoryRepository;


@Service
public class LoadStatusHistoryServiceImpl implements LoadStatusHistoryService {

    private final LoadStatusHistoryRepository loadStatusHistoryRepository;
    private final LoadStatusHistoryMapper loadStatusHistoryMapper;

    public LoadStatusHistoryServiceImpl(
            final LoadStatusHistoryRepository loadStatusHistoryRepository,
            final LoadStatusHistoryMapper loadStatusHistoryMapper) {
        this.loadStatusHistoryRepository = loadStatusHistoryRepository;
        this.loadStatusHistoryMapper = loadStatusHistoryMapper;
    }

    @Override
    public List<LoadStatusHistoryDTO> findAll() {
        final List<LoadStatusHistory> loadStatusHistories = loadStatusHistoryRepository.findAll(Sort.by("id"));
        return loadStatusHistories.stream()
                .map(loadStatusHistory -> loadStatusHistoryMapper.updateLoadStatusHistoryDTO(loadStatusHistory, new LoadStatusHistoryDTO()))
                .toList();
    }

    @Override
    public LoadStatusHistoryDTO get(final UUID id) {
        return loadStatusHistoryRepository.findById(id)
                .map(loadStatusHistory -> loadStatusHistoryMapper.updateLoadStatusHistoryDTO(loadStatusHistory, new LoadStatusHistoryDTO()))
                .orElseThrow(NotFoundException::new);
    }

    @Override
    public UUID create(final LoadStatusHistoryDTO loadStatusHistoryDTO) {
        final LoadStatusHistory loadStatusHistory = new LoadStatusHistory();
        loadStatusHistoryMapper.updateLoadStatusHistory(loadStatusHistoryDTO, loadStatusHistory);
        return loadStatusHistoryRepository.save(loadStatusHistory).getId();
    }

    @Override
    public void update(final UUID id, final LoadStatusHistoryDTO loadStatusHistoryDTO) {
        final LoadStatusHistory loadStatusHistory = loadStatusHistoryRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        loadStatusHistoryMapper.updateLoadStatusHistory(loadStatusHistoryDTO, loadStatusHistory);
        loadStatusHistoryRepository.save(loadStatusHistory);
    }

    @Override
    public void delete(final UUID id) {
        loadStatusHistoryRepository.deleteById(id);
    }

}
