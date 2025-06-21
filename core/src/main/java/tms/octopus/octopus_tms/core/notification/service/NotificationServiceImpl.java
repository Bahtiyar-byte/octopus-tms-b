package tms.octopus.octopus_tms.core.notification.service;

import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import tms.octopus.octopus_tms.base.util.NotFoundException;
import tms.octopus.octopus_tms.core.notification.domain.Notification;
import tms.octopus.octopus_tms.core.notification.model.NotificationDTO;
import tms.octopus.octopus_tms.core.notification.repos.NotificationRepository;
import tms.octopus.octopus_tms.core.user.repos.UserRepository;


@Service
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final NotificationMapper notificationMapper;

    public NotificationServiceImpl(final NotificationRepository notificationRepository,
            final UserRepository userRepository, final NotificationMapper notificationMapper) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
        this.notificationMapper = notificationMapper;
    }

    @Override
    public List<NotificationDTO> findAll() {
        final List<Notification> notifications = notificationRepository.findAll(Sort.by("id"));
        return notifications.stream()
                .map(notification -> notificationMapper.updateNotificationDTO(notification, new NotificationDTO()))
                .toList();
    }

    @Override
    public NotificationDTO get(final UUID id) {
        return notificationRepository.findById(id)
                .map(notification -> notificationMapper.updateNotificationDTO(notification, new NotificationDTO()))
                .orElseThrow(NotFoundException::new);
    }

    @Override
    public UUID create(final NotificationDTO notificationDTO) {
        final Notification notification = new Notification();
        notificationMapper.updateNotification(notificationDTO, notification, userRepository);
        return notificationRepository.save(notification).getId();
    }

    @Override
    public void update(final UUID id, final NotificationDTO notificationDTO) {
        final Notification notification = notificationRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        notificationMapper.updateNotification(notificationDTO, notification, userRepository);
        notificationRepository.save(notification);
    }

    @Override
    public void delete(final UUID id) {
        notificationRepository.deleteById(id);
    }

}
