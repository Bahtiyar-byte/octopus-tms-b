package tms.octopus.octopus_tms.carrier.driver.service;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;
import tms.octopus.octopus_tms.carrier.driver.domain.Driver;
import tms.octopus.octopus_tms.carrier.driver.model.DriverDTO;


@Mapper(
        componentModel = MappingConstants.ComponentModel.SPRING,
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface DriverMapper {

    DriverDTO updateDriverDTO(Driver driver, @MappingTarget DriverDTO driverDTO);

    @Mapping(target = "id", ignore = true)
    Driver updateDriver(DriverDTO driverDTO, @MappingTarget Driver driver);

}
