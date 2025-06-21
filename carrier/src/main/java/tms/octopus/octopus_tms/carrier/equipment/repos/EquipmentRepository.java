package tms.octopus.octopus_tms.carrier.equipment.repos;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import tms.octopus.octopus_tms.carrier.equipment.domain.Equipment;


public interface EquipmentRepository extends JpaRepository<Equipment, UUID> {
}
