package tms.octopus.octopus_tms.financial.rate_agreement.service;

import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import tms.octopus.octopus_tms.base.util.NotFoundException;
import tms.octopus.octopus_tms.financial.rate_agreement.domain.RateAgreement;
import tms.octopus.octopus_tms.financial.rate_agreement.model.RateAgreementDTO;
import tms.octopus.octopus_tms.financial.rate_agreement.repos.RateAgreementRepository;


@Service
public class RateAgreementServiceImpl implements RateAgreementService {

    private final RateAgreementRepository rateAgreementRepository;
    private final RateAgreementMapper rateAgreementMapper;

    public RateAgreementServiceImpl(final RateAgreementRepository rateAgreementRepository,
            final RateAgreementMapper rateAgreementMapper) {
        this.rateAgreementRepository = rateAgreementRepository;
        this.rateAgreementMapper = rateAgreementMapper;
    }

    @Override
    public Page<RateAgreementDTO> findAll(final String filter, final Pageable pageable) {
        Page<RateAgreement> page;
        if (filter != null) {
            UUID uuidFilter = null;
            try {
                uuidFilter = UUID.fromString(filter);
            } catch (final IllegalArgumentException illegalArgumentException) {
                // keep null - no parseable input
            }
            page = rateAgreementRepository.findAllById(uuidFilter, pageable);
        } else {
            page = rateAgreementRepository.findAll(pageable);
        }
        return new PageImpl<>(page.getContent()
                .stream()
                .map(rateAgreement -> rateAgreementMapper.updateRateAgreementDTO(rateAgreement, new RateAgreementDTO()))
                .toList(),
                pageable, page.getTotalElements());
    }

    @Override
    public RateAgreementDTO get(final UUID id) {
        return rateAgreementRepository.findById(id)
                .map(rateAgreement -> rateAgreementMapper.updateRateAgreementDTO(rateAgreement, new RateAgreementDTO()))
                .orElseThrow(NotFoundException::new);
    }

    @Override
    public UUID create(final RateAgreementDTO rateAgreementDTO) {
        final RateAgreement rateAgreement = new RateAgreement();
        rateAgreementMapper.updateRateAgreement(rateAgreementDTO, rateAgreement);
        return rateAgreementRepository.save(rateAgreement).getId();
    }

    @Override
    public void update(final UUID id, final RateAgreementDTO rateAgreementDTO) {
        final RateAgreement rateAgreement = rateAgreementRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        rateAgreementMapper.updateRateAgreement(rateAgreementDTO, rateAgreement);
        rateAgreementRepository.save(rateAgreement);
    }

    @Override
    public void delete(final UUID id) {
        rateAgreementRepository.deleteById(id);
    }

}
