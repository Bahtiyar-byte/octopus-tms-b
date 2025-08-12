package tms.octopus.octopus_tms.core.company.repos;

import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import tms.octopus.octopus_tms.base.company.model.CompanyType;
import tms.octopus.octopus_tms.core.company.domain.Company;


public interface CompanyRepository extends JpaRepository<Company, UUID> {

    Page<Company> findAllById(UUID id, Pageable pageable);

    List<Company> findByType(CompanyType type);

}
