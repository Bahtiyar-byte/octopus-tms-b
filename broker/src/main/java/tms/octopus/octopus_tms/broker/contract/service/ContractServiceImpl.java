package tms.octopus.octopus_tms.broker.contract.service;

import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import tms.octopus.octopus_tms.base.util.NotFoundException;
import tms.octopus.octopus_tms.broker.contract.domain.Contract;
import tms.octopus.octopus_tms.broker.contract.model.ContractDTO;
import tms.octopus.octopus_tms.broker.contract.repos.ContractRepository;


@Service
public class ContractServiceImpl implements ContractService {

    private final ContractRepository contractRepository;
    private final ContractMapper contractMapper;

    public ContractServiceImpl(final ContractRepository contractRepository,
            final ContractMapper contractMapper) {
        this.contractRepository = contractRepository;
        this.contractMapper = contractMapper;
    }

    @Override
    public List<ContractDTO> findAll(final String filter) {
        List<Contract> contracts;
        final Sort sort = Sort.by("id");
        if (filter != null) {
            UUID uuidFilter = null;
            try {
                uuidFilter = UUID.fromString(filter);
            } catch (final IllegalArgumentException illegalArgumentException) {
                // keep null - no parseable input
            }
            contracts = contractRepository.findAllById(uuidFilter, sort);
        } else {
            contracts = contractRepository.findAll(sort);
        }
        return contracts.stream()
                .map(contract -> contractMapper.updateContractDTO(contract, new ContractDTO()))
                .toList();
    }

    @Override
    public ContractDTO get(final UUID id) {
        return contractRepository.findById(id)
                .map(contract -> contractMapper.updateContractDTO(contract, new ContractDTO()))
                .orElseThrow(NotFoundException::new);
    }

    @Override
    public UUID create(final ContractDTO contractDTO) {
        final Contract contract = new Contract();
        contractMapper.updateContract(contractDTO, contract);
        return contractRepository.save(contract).getId();
    }

    @Override
    public void update(final UUID id, final ContractDTO contractDTO) {
        final Contract contract = contractRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        contractMapper.updateContract(contractDTO, contract);
        contractRepository.save(contract);
    }

    @Override
    public void delete(final UUID id) {
        contractRepository.deleteById(id);
    }

}
