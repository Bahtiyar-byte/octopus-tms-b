package tms.octopus.octopus_tms.core.user.repos;

import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import tms.octopus.octopus_tms.core.company.domain.Company;
import tms.octopus.octopus_tms.core.user.domain.User;


public interface UserRepository extends JpaRepository<User, UUID> {

    User findByUsernameIgnoreCase(String username);
    
    @Query("SELECT u FROM User u LEFT JOIN FETCH u.company WHERE LOWER(u.username) = LOWER(:username)")
    User findByUsernameIgnoreCaseWithCompany(@Param("username") String username);

    User findByResetToken(String resetToken);

    Page<User> findAllById(UUID id, Pageable pageable);

    boolean existsByUsernameIgnoreCase(String username);
    
    boolean existsByEmailIgnoreCase(String email);

    User findFirstByCompany(Company company);
    
    @Query("SELECT u FROM User u LEFT JOIN FETCH u.company")
    Page<User> findAllWithCompany(Pageable pageable);
    
    @Query("SELECT u FROM User u LEFT JOIN FETCH u.company WHERE u.id = :id")
    Page<User> findAllByIdWithCompany(@Param("id") UUID id, Pageable pageable);
    
    @Query("SELECT u FROM User u LEFT JOIN FETCH u.company WHERE u.companyType = :companyType")
    Page<User> findAllByCompanyType(@Param("companyType") String companyType, Pageable pageable);

}
