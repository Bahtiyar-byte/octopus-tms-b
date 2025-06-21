package tms.octopus.octopus_tms.broker.contract.service;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;
import tms.octopus.octopus_tms.broker.contract.domain.Contract;
import tms.octopus.octopus_tms.broker.contract.model.ContractDTO;


@Mapper(
        componentModel = MappingConstants.ComponentModel.SPRING,
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface ContractMapper {

    ContractDTO updateContractDTO(Contract contract, @MappingTarget ContractDTO contractDTO);

    @Mapping(target = "id", ignore = true)
    Contract updateContract(ContractDTO contractDTO, @MappingTarget Contract contract);

}
