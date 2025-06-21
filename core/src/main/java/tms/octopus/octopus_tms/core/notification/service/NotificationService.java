package tms.octopus.octopus_tms.core.notification.service;

import java.util.List;
import java.util.UUID;
import tms.octopus.octopus_tms.core.notification.model.NotificationDTO;


public interface NotificationService {

    List<NotificationDTO> findAll();

    NotificationDTO get(UUID id);

    UUID create(NotificationDTO notificationDTO);

    void update(UUID id, NotificationDTO notificationDTO);

    void delete(UUID id);

}
