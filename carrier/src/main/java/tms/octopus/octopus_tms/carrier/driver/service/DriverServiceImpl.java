package tms.octopus.octopus_tms.carrier.driver.service;

import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import tms.octopus.octopus_tms.base.util.NotFoundException;
import tms.octopus.octopus_tms.base.util.ReferencedWarning;
import tms.octopus.octopus_tms.carrier.driver.domain.Driver;
import tms.octopus.octopus_tms.carrier.driver.model.DriverDTO;
import tms.octopus.octopus_tms.carrier.driver.repos.DriverRepository;
import tms.octopus.octopus_tms.carrier.driver_performance.domain.DriverPerformance;
import tms.octopus.octopus_tms.carrier.driver_performance.repos.DriverPerformanceRepository;


@Service
public class DriverServiceImpl implements DriverService {

    private final DriverRepository driverRepository;
    private final DriverMapper driverMapper;
    private final DriverPerformanceRepository driverPerformanceRepository;

    public DriverServiceImpl(final DriverRepository driverRepository,
            final DriverMapper driverMapper,
            final DriverPerformanceRepository driverPerformanceRepository) {
        this.driverRepository = driverRepository;
        this.driverMapper = driverMapper;
        this.driverPerformanceRepository = driverPerformanceRepository;
    }

    @Override
    public Page<DriverDTO> findAll(final String filter, final Pageable pageable) {
        Page<Driver> page;
        if (filter != null) {
            UUID uuidFilter = null;
            try {
                uuidFilter = UUID.fromString(filter);
            } catch (final IllegalArgumentException illegalArgumentException) {
                // keep null - no parseable input
            }
            page = driverRepository.findAllById(uuidFilter, pageable);
        } else {
            page = driverRepository.findAll(pageable);
        }
        return new PageImpl<>(page.getContent()
                .stream()
                .map(driver -> driverMapper.updateDriverDTO(driver, new DriverDTO()))
                .toList(),
                pageable, page.getTotalElements());
    }

    @Override
    public DriverDTO get(final UUID id) {
        return driverRepository.findById(id)
                .map(driver -> driverMapper.updateDriverDTO(driver, new DriverDTO()))
                .orElseThrow(NotFoundException::new);
    }

    @Override
    public UUID create(final DriverDTO driverDTO) {
        final Driver driver = new Driver();
        driverMapper.updateDriver(driverDTO, driver);
        return driverRepository.save(driver).getId();
    }

    @Override
    public void update(final UUID id, final DriverDTO driverDTO) {
        final Driver driver = driverRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        driverMapper.updateDriver(driverDTO, driver);
        driverRepository.save(driver);
    }

    @Override
    public void delete(final UUID id) {
        driverRepository.deleteById(id);
    }

    @Override
    public ReferencedWarning getReferencedWarning(final UUID id) {
        final ReferencedWarning referencedWarning = new ReferencedWarning();
        final Driver driver = driverRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        final DriverPerformance driverDriverPerformance = driverPerformanceRepository.findFirstByDriver(driver);
        if (driverDriverPerformance != null) {
            referencedWarning.setKey("driver.driverPerformance.driver.referenced");
            referencedWarning.addParam(driverDriverPerformance.getId());
            return referencedWarning;
        }
        return null;
    }

}
