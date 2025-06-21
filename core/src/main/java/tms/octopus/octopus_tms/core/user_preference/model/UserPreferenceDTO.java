package tms.octopus.octopus_tms.core.user_preference.model;

import jakarta.validation.constraints.Size;
import java.time.OffsetDateTime;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class UserPreferenceDTO {

    private UUID id;

    @Size(max = 50)
    private String theme;

    @Size(max = 100)
    private String timezone;

    private Boolean notificationsEmail;

    private Boolean notificationsSms;

    private Boolean notificationsPush;

    @Size(max = 10)
    private String language;

    private String dashboardLayout;

    private OffsetDateTime createdAt;

    private OffsetDateTime updatedAt;

    @UserPreferenceUserUnique
    private UUID user;

}
