package tms.octopus.octopus_tms.financial.rate_agreement.service;

import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import tms.octopus.octopus_tms.financial.rate_agreement.model.RateAgreementDTO;


public interface RateAgreementService {

    Page<RateAgreementDTO> findAll(String filter, Pageable pageable);

    RateAgreementDTO get(UUID id);

    UUID create(RateAgreementDTO rateAgreementDTO);

    void update(UUID id, RateAgreementDTO rateAgreementDTO);

    void delete(UUID id);

}
