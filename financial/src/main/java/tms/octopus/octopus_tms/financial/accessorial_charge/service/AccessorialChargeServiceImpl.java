package tms.octopus.octopus_tms.financial.accessorial_charge.service;

import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import tms.octopus.octopus_tms.base.util.NotFoundException;
import tms.octopus.octopus_tms.financial.accessorial_charge.domain.AccessorialCharge;
import tms.octopus.octopus_tms.financial.accessorial_charge.model.AccessorialChargeDTO;
import tms.octopus.octopus_tms.financial.accessorial_charge.repos.AccessorialChargeRepository;


@Service
public class AccessorialChargeServiceImpl implements AccessorialChargeService {

    private final AccessorialChargeRepository accessorialChargeRepository;
    private final AccessorialChargeMapper accessorialChargeMapper;

    public AccessorialChargeServiceImpl(
            final AccessorialChargeRepository accessorialChargeRepository,
            final AccessorialChargeMapper accessorialChargeMapper) {
        this.accessorialChargeRepository = accessorialChargeRepository;
        this.accessorialChargeMapper = accessorialChargeMapper;
    }

    @Override
    public List<AccessorialChargeDTO> findAll() {
        final List<AccessorialCharge> accessorialCharges = accessorialChargeRepository.findAll(Sort.by("id"));
        return accessorialCharges.stream()
                .map(accessorialCharge -> accessorialChargeMapper.updateAccessorialChargeDTO(accessorialCharge, new AccessorialChargeDTO()))
                .toList();
    }

    @Override
    public AccessorialChargeDTO get(final UUID id) {
        return accessorialChargeRepository.findById(id)
                .map(accessorialCharge -> accessorialChargeMapper.updateAccessorialChargeDTO(accessorialCharge, new AccessorialChargeDTO()))
                .orElseThrow(NotFoundException::new);
    }

    @Override
    public UUID create(final AccessorialChargeDTO accessorialChargeDTO) {
        final AccessorialCharge accessorialCharge = new AccessorialCharge();
        accessorialChargeMapper.updateAccessorialCharge(accessorialChargeDTO, accessorialCharge);
        return accessorialChargeRepository.save(accessorialCharge).getId();
    }

    @Override
    public void update(final UUID id, final AccessorialChargeDTO accessorialChargeDTO) {
        final AccessorialCharge accessorialCharge = accessorialChargeRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        accessorialChargeMapper.updateAccessorialCharge(accessorialChargeDTO, accessorialCharge);
        accessorialChargeRepository.save(accessorialCharge);
    }

    @Override
    public void delete(final UUID id) {
        accessorialChargeRepository.deleteById(id);
    }

}
