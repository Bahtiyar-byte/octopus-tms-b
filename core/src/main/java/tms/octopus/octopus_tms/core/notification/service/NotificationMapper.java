package tms.octopus.octopus_tms.core.notification.service;

import org.mapstruct.AfterMapping;
import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;
import tms.octopus.octopus_tms.base.util.NotFoundException;
import tms.octopus.octopus_tms.core.notification.domain.Notification;
import tms.octopus.octopus_tms.core.notification.model.NotificationDTO;
import tms.octopus.octopus_tms.core.user.domain.User;
import tms.octopus.octopus_tms.core.user.repos.UserRepository;


@Mapper(
        componentModel = MappingConstants.ComponentModel.SPRING,
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface NotificationMapper {

    @Mapping(target = "user", ignore = true)
    NotificationDTO updateNotificationDTO(Notification notification,
            @MappingTarget NotificationDTO notificationDTO);

    @AfterMapping
    default void afterUpdateNotificationDTO(Notification notification,
            @MappingTarget NotificationDTO notificationDTO) {
        notificationDTO.setUser(notification.getUser() == null ? null : notification.getUser().getId());
    }

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    Notification updateNotification(NotificationDTO notificationDTO,
            @MappingTarget Notification notification, @Context UserRepository userRepository);

    @AfterMapping
    default void afterUpdateNotification(NotificationDTO notificationDTO,
            @MappingTarget Notification notification, @Context UserRepository userRepository) {
        final User user = notificationDTO.getUser() == null ? null : userRepository.findById(notificationDTO.getUser())
                .orElseThrow(() -> new NotFoundException("user not found"));
        notification.setUser(user);
    }

}
