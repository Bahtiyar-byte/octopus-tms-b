package tms.octopus.octopus_tms.financial.accessorial_charge.service;

import java.util.List;
import java.util.UUID;
import tms.octopus.octopus_tms.financial.accessorial_charge.model.AccessorialChargeDTO;


public interface AccessorialChargeService {

    List<AccessorialChargeDTO> findAll();

    AccessorialChargeDTO get(UUID id);

    UUID create(AccessorialChargeDTO accessorialChargeDTO);

    void update(UUID id, AccessorialChargeDTO accessorialChargeDTO);

    void delete(UUID id);

}
