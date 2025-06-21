package tms.octopus.octopus_tms.financial.accessorial_charge.service;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;
import tms.octopus.octopus_tms.financial.accessorial_charge.domain.AccessorialCharge;
import tms.octopus.octopus_tms.financial.accessorial_charge.model.AccessorialChargeDTO;


@Mapper(
        componentModel = MappingConstants.ComponentModel.SPRING,
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface AccessorialChargeMapper {

    AccessorialChargeDTO updateAccessorialChargeDTO(AccessorialCharge accessorialCharge,
            @MappingTarget AccessorialChargeDTO accessorialChargeDTO);

    @Mapping(target = "id", ignore = true)
    AccessorialCharge updateAccessorialCharge(AccessorialChargeDTO accessorialChargeDTO,
            @MappingTarget AccessorialCharge accessorialCharge);

}
