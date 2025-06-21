package tms.octopus.octopus_tms.load.load_stop.service;

import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import tms.octopus.octopus_tms.base.util.NotFoundException;
import tms.octopus.octopus_tms.base.util.ReferencedWarning;
import tms.octopus.octopus_tms.load.load.repos.LoadRepository;
import tms.octopus.octopus_tms.load.load_cargo.domain.LoadCargo;
import tms.octopus.octopus_tms.load.load_cargo.repos.LoadCargoRepository;
import tms.octopus.octopus_tms.load.load_stop.domain.LoadStop;
import tms.octopus.octopus_tms.load.load_stop.model.LoadStopDTO;
import tms.octopus.octopus_tms.load.load_stop.repos.LoadStopRepository;


@Service
public class LoadStopServiceImpl implements LoadStopService {

    private final LoadStopRepository loadStopRepository;
    private final LoadRepository loadRepository;
    private final LoadStopMapper loadStopMapper;
    private final LoadCargoRepository loadCargoRepository;

    public LoadStopServiceImpl(final LoadStopRepository loadStopRepository,
            final LoadRepository loadRepository, final LoadStopMapper loadStopMapper,
            final LoadCargoRepository loadCargoRepository) {
        this.loadStopRepository = loadStopRepository;
        this.loadRepository = loadRepository;
        this.loadStopMapper = loadStopMapper;
        this.loadCargoRepository = loadCargoRepository;
    }

    @Override
    public List<LoadStopDTO> findAll() {
        final List<LoadStop> loadStops = loadStopRepository.findAll(Sort.by("id"));
        return loadStops.stream()
                .map(loadStop -> loadStopMapper.updateLoadStopDTO(loadStop, new LoadStopDTO()))
                .toList();
    }

    @Override
    public LoadStopDTO get(final UUID id) {
        return loadStopRepository.findById(id)
                .map(loadStop -> loadStopMapper.updateLoadStopDTO(loadStop, new LoadStopDTO()))
                .orElseThrow(NotFoundException::new);
    }

    @Override
    public UUID create(final LoadStopDTO loadStopDTO) {
        final LoadStop loadStop = new LoadStop();
        loadStopMapper.updateLoadStop(loadStopDTO, loadStop, loadRepository);
        return loadStopRepository.save(loadStop).getId();
    }

    @Override
    public void update(final UUID id, final LoadStopDTO loadStopDTO) {
        final LoadStop loadStop = loadStopRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        loadStopMapper.updateLoadStop(loadStopDTO, loadStop, loadRepository);
        loadStopRepository.save(loadStop);
    }

    @Override
    public void delete(final UUID id) {
        loadStopRepository.deleteById(id);
    }

    @Override
    public ReferencedWarning getReferencedWarning(final UUID id) {
        final ReferencedWarning referencedWarning = new ReferencedWarning();
        final LoadStop loadStop = loadStopRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        final LoadCargo pickupStopLoadCargo = loadCargoRepository.findFirstByPickupStop(loadStop);
        if (pickupStopLoadCargo != null) {
            referencedWarning.setKey("loadStop.loadCargo.pickupStop.referenced");
            referencedWarning.addParam(pickupStopLoadCargo.getId());
            return referencedWarning;
        }
        final LoadCargo deliveryStopLoadCargo = loadCargoRepository.findFirstByDeliveryStop(loadStop);
        if (deliveryStopLoadCargo != null) {
            referencedWarning.setKey("loadStop.loadCargo.deliveryStop.referenced");
            referencedWarning.addParam(deliveryStopLoadCargo.getId());
            return referencedWarning;
        }
        return null;
    }

}
