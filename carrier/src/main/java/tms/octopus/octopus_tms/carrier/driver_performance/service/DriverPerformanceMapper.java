package tms.octopus.octopus_tms.carrier.driver_performance.service;

import org.mapstruct.AfterMapping;
import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;
import tms.octopus.octopus_tms.base.util.NotFoundException;
import tms.octopus.octopus_tms.carrier.driver.domain.Driver;
import tms.octopus.octopus_tms.carrier.driver.repos.DriverRepository;
import tms.octopus.octopus_tms.carrier.driver_performance.domain.DriverPerformance;
import tms.octopus.octopus_tms.carrier.driver_performance.model.DriverPerformanceDTO;


@Mapper(
        componentModel = MappingConstants.ComponentModel.SPRING,
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface DriverPerformanceMapper {

    @Mapping(target = "driver", ignore = true)
    DriverPerformanceDTO updateDriverPerformanceDTO(DriverPerformance driverPerformance,
            @MappingTarget DriverPerformanceDTO driverPerformanceDTO);

    @AfterMapping
    default void afterUpdateDriverPerformanceDTO(DriverPerformance driverPerformance,
            @MappingTarget DriverPerformanceDTO driverPerformanceDTO) {
        driverPerformanceDTO.setDriver(driverPerformance.getDriver() == null ? null : driverPerformance.getDriver().getId());
    }

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "driver", ignore = true)
    DriverPerformance updateDriverPerformance(DriverPerformanceDTO driverPerformanceDTO,
            @MappingTarget DriverPerformance driverPerformance,
            @Context DriverRepository driverRepository);

    @AfterMapping
    default void afterUpdateDriverPerformance(DriverPerformanceDTO driverPerformanceDTO,
            @MappingTarget DriverPerformance driverPerformance,
            @Context DriverRepository driverRepository) {
        final Driver driver = driverPerformanceDTO.getDriver() == null ? null : driverRepository.findById(driverPerformanceDTO.getDriver())
                .orElseThrow(() -> new NotFoundException("driver not found"));
        driverPerformance.setDriver(driver);
    }

}
