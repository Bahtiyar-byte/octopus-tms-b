package tms.octopus.octopus_tms.core.user.repos;

import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import tms.octopus.octopus_tms.core.company.domain.Company;
import tms.octopus.octopus_tms.core.user.domain.User;


public interface UserRepository extends JpaRepository<User, UUID> {

    User findByUsernameIgnoreCase(String username);

    User findByResetToken(String resetToken);

    Page<User> findAllById(UUID id, Pageable pageable);

    boolean existsByUsernameIgnoreCase(String username);

    User findFirstByCompany(Company company);

}
