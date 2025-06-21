package tms.octopus.octopus_tms.core.company.service;

import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import tms.octopus.octopus_tms.base.util.ReferencedWarning;
import tms.octopus.octopus_tms.core.company.model.CompanyDTO;


public interface CompanyService {

    Page<CompanyDTO> findAll(String filter, Pageable pageable);

    CompanyDTO get(UUID id);

    UUID create(CompanyDTO companyDTO);

    void update(UUID id, CompanyDTO companyDTO);

    void delete(UUID id);

    ReferencedWarning getReferencedWarning(UUID id);

}
