package tms.octopus.octopus_tms.core.user.model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.OffsetDateTime;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;
import tms.octopus.octopus_tms.base.user.model.UserRole;
import tms.octopus.octopus_tms.base.util.WebUtils;


@Getter
@Setter
public class UserDTO {

    private UUID id;

    @NotNull
    @Size(max = 100)
    @Email(regexp = WebUtils.EMAIL_PATTERN)
    private String username;

    @NotNull
    @Size(max = 255)
    private String email;

    @NotNull
    @Size(max = 255)
    private String passwordHash;

    @Size(max = 100)
    private String firstName;

    @Size(max = 100)
    private String lastName;

    @Size(max = 50)
    private String phone;

    @NotNull
    private UserRole role;

    @Size(max = 100)
    private String department;

    @Size(max = 500)
    private String avatarUrl;

    @Size(max = 50)
    private String status;

    private OffsetDateTime lastLogin;

    private Integer failedLoginAttempts;

    private OffsetDateTime lockedUntil;

    @Size(max = 255)
    private String resetToken;

    private OffsetDateTime resetTokenStarts;

    private OffsetDateTime createdAt;

    private OffsetDateTime updatedAt;

    private UUID company;

}
