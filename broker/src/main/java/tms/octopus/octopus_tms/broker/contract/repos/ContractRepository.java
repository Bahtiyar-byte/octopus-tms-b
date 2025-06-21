package tms.octopus.octopus_tms.broker.contract.repos;

import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import tms.octopus.octopus_tms.broker.contract.domain.Contract;


public interface ContractRepository extends JpaRepository<Contract, UUID> {

    List<Contract> findAllById(UUID id, Sort sort);

}
