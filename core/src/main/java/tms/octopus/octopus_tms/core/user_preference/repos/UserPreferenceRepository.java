package tms.octopus.octopus_tms.core.user_preference.repos;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import tms.octopus.octopus_tms.core.user.domain.User;
import tms.octopus.octopus_tms.core.user_preference.domain.UserPreference;


public interface UserPreferenceRepository extends JpaRepository<UserPreference, UUID> {

    UserPreference findFirstByUser(User user);

    boolean existsByUserId(UUID id);

}
