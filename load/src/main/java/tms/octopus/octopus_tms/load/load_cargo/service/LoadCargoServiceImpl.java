package tms.octopus.octopus_tms.load.load_cargo.service;

import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import tms.octopus.octopus_tms.base.util.NotFoundException;
import tms.octopus.octopus_tms.load.load.repos.LoadRepository;
import tms.octopus.octopus_tms.load.load_cargo.domain.LoadCargo;
import tms.octopus.octopus_tms.load.load_cargo.model.LoadCargoDTO;
import tms.octopus.octopus_tms.load.load_cargo.repos.LoadCargoRepository;
import tms.octopus.octopus_tms.load.load_stop.repos.LoadStopRepository;


@Service
public class LoadCargoServiceImpl implements LoadCargoService {

    private final LoadCargoRepository loadCargoRepository;
    private final LoadRepository loadRepository;
    private final LoadStopRepository loadStopRepository;
    private final LoadCargoMapper loadCargoMapper;

    public LoadCargoServiceImpl(final LoadCargoRepository loadCargoRepository,
            final LoadRepository loadRepository, final LoadStopRepository loadStopRepository,
            final LoadCargoMapper loadCargoMapper) {
        this.loadCargoRepository = loadCargoRepository;
        this.loadRepository = loadRepository;
        this.loadStopRepository = loadStopRepository;
        this.loadCargoMapper = loadCargoMapper;
    }

    @Override
    public List<LoadCargoDTO> findAll() {
        final List<LoadCargo> loadCargoes = loadCargoRepository.findAll(Sort.by("id"));
        return loadCargoes.stream()
                .map(loadCargo -> loadCargoMapper.updateLoadCargoDTO(loadCargo, new LoadCargoDTO()))
                .toList();
    }

    @Override
    public LoadCargoDTO get(final UUID id) {
        return loadCargoRepository.findById(id)
                .map(loadCargo -> loadCargoMapper.updateLoadCargoDTO(loadCargo, new LoadCargoDTO()))
                .orElseThrow(NotFoundException::new);
    }

    @Override
    public UUID create(final LoadCargoDTO loadCargoDTO) {
        final LoadCargo loadCargo = new LoadCargo();
        loadCargoMapper.updateLoadCargo(loadCargoDTO, loadCargo, loadRepository, loadStopRepository);
        return loadCargoRepository.save(loadCargo).getId();
    }

    @Override
    public void update(final UUID id, final LoadCargoDTO loadCargoDTO) {
        final LoadCargo loadCargo = loadCargoRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        loadCargoMapper.updateLoadCargo(loadCargoDTO, loadCargo, loadRepository, loadStopRepository);
        loadCargoRepository.save(loadCargo);
    }

    @Override
    public void delete(final UUID id) {
        loadCargoRepository.deleteById(id);
    }

}
