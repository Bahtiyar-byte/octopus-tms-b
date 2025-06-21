package tms.octopus.octopus_tms.core.notification.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.OffsetDateTime;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class NotificationDTO {

    private UUID id;

    @NotNull
    @Size(max = 50)
    private String type;

    @Size(max = 255)
    private String title;

    private String message;

    private String data;

    private Boolean read;

    private OffsetDateTime readAt;

    private OffsetDateTime createdAt;

    @NotNull
    private UUID user;

}
