package tms.octopus.octopus_tms.core.company.service;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;
import tms.octopus.octopus_tms.core.company.domain.Company;
import tms.octopus.octopus_tms.core.company.model.CompanyDTO;


@Mapper(
        componentModel = MappingConstants.ComponentModel.SPRING,
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface CompanyMapper {

    CompanyDTO updateCompanyDTO(Company company, @MappingTarget CompanyDTO companyDTO);

    @Mapping(target = "id", ignore = true)
    Company updateCompany(CompanyDTO companyDTO, @MappingTarget Company company);

}
