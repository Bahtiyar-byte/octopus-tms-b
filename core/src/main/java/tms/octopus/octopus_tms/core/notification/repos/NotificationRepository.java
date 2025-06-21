package tms.octopus.octopus_tms.core.notification.repos;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import tms.octopus.octopus_tms.core.notification.domain.Notification;
import tms.octopus.octopus_tms.core.user.domain.User;


public interface NotificationRepository extends JpaRepository<Notification, UUID> {

    Notification findFirstByUser(User user);

}
