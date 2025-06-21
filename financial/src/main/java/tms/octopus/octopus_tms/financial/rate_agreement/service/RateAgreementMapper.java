package tms.octopus.octopus_tms.financial.rate_agreement.service;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;
import tms.octopus.octopus_tms.financial.rate_agreement.domain.RateAgreement;
import tms.octopus.octopus_tms.financial.rate_agreement.model.RateAgreementDTO;


@Mapper(
        componentModel = MappingConstants.ComponentModel.SPRING,
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface RateAgreementMapper {

    RateAgreementDTO updateRateAgreementDTO(RateAgreement rateAgreement,
            @MappingTarget RateAgreementDTO rateAgreementDTO);

    @Mapping(target = "id", ignore = true)
    RateAgreement updateRateAgreement(RateAgreementDTO rateAgreementDTO,
            @MappingTarget RateAgreement rateAgreement);

}
