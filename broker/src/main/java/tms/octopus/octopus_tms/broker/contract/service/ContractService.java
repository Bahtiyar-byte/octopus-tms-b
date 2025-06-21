package tms.octopus.octopus_tms.broker.contract.service;

import java.util.List;
import java.util.UUID;
import tms.octopus.octopus_tms.broker.contract.model.ContractDTO;


public interface ContractService {

    List<ContractDTO> findAll(String filter);

    ContractDTO get(UUID id);

    UUID create(ContractDTO contractDTO);

    void update(UUID id, ContractDTO contractDTO);

    void delete(UUID id);

}
