package tms.octopus.octopus_tms.financial.rate_agreement.repos;

import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import tms.octopus.octopus_tms.financial.rate_agreement.domain.RateAgreement;


public interface RateAgreementRepository extends JpaRepository<RateAgreement, UUID> {

    Page<RateAgreement> findAllById(UUID id, Pageable pageable);

}
