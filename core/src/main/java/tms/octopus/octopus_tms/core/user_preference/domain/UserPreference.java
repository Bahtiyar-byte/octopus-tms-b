package tms.octopus.octopus_tms.core.user_preference.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.time.OffsetDateTime;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;
import tms.octopus.octopus_tms.core.user.domain.User;


@Entity
@Table(name = "UserPreferences")
@Getter
@Setter
public class UserPreference {

    @Id
    @Column(nullable = false, updatable = false)
    @GeneratedValue
    @UuidGenerator
    private UUID id;

    @Column(length = 50)
    private String theme;

    @Column(length = 100)
    private String timezone;

    @Column
    private Boolean notificationsEmail;

    @Column
    private Boolean notificationsSms;

    @Column
    private Boolean notificationsPush;

    @Column(length = 10)
    private String language;

    @Column(columnDefinition = "text")
    private String dashboardLayout;

    @Column
    private OffsetDateTime createdAt;

    @Column
    private OffsetDateTime updatedAt;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", unique = true)
    private User user;

}
