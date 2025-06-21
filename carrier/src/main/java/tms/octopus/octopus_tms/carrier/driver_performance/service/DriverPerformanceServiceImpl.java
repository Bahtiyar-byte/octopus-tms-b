package tms.octopus.octopus_tms.carrier.driver_performance.service;

import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import tms.octopus.octopus_tms.base.util.NotFoundException;
import tms.octopus.octopus_tms.carrier.driver.repos.DriverRepository;
import tms.octopus.octopus_tms.carrier.driver_performance.domain.DriverPerformance;
import tms.octopus.octopus_tms.carrier.driver_performance.model.DriverPerformanceDTO;
import tms.octopus.octopus_tms.carrier.driver_performance.repos.DriverPerformanceRepository;


@Service
public class DriverPerformanceServiceImpl implements DriverPerformanceService {

    private final DriverPerformanceRepository driverPerformanceRepository;
    private final DriverRepository driverRepository;
    private final DriverPerformanceMapper driverPerformanceMapper;

    public DriverPerformanceServiceImpl(
            final DriverPerformanceRepository driverPerformanceRepository,
            final DriverRepository driverRepository,
            final DriverPerformanceMapper driverPerformanceMapper) {
        this.driverPerformanceRepository = driverPerformanceRepository;
        this.driverRepository = driverRepository;
        this.driverPerformanceMapper = driverPerformanceMapper;
    }

    @Override
    public Page<DriverPerformanceDTO> findAll(final Pageable pageable) {
        final Page<DriverPerformance> page = driverPerformanceRepository.findAll(pageable);
        return new PageImpl<>(page.getContent()
                .stream()
                .map(driverPerformance -> driverPerformanceMapper.updateDriverPerformanceDTO(driverPerformance, new DriverPerformanceDTO()))
                .toList(),
                pageable, page.getTotalElements());
    }

    @Override
    public DriverPerformanceDTO get(final UUID id) {
        return driverPerformanceRepository.findById(id)
                .map(driverPerformance -> driverPerformanceMapper.updateDriverPerformanceDTO(driverPerformance, new DriverPerformanceDTO()))
                .orElseThrow(NotFoundException::new);
    }

    @Override
    public UUID create(final DriverPerformanceDTO driverPerformanceDTO) {
        final DriverPerformance driverPerformance = new DriverPerformance();
        driverPerformanceMapper.updateDriverPerformance(driverPerformanceDTO, driverPerformance, driverRepository);
        return driverPerformanceRepository.save(driverPerformance).getId();
    }

    @Override
    public void update(final UUID id, final DriverPerformanceDTO driverPerformanceDTO) {
        final DriverPerformance driverPerformance = driverPerformanceRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        driverPerformanceMapper.updateDriverPerformance(driverPerformanceDTO, driverPerformance, driverRepository);
        driverPerformanceRepository.save(driverPerformance);
    }

    @Override
    public void delete(final UUID id) {
        driverPerformanceRepository.deleteById(id);
    }

}
