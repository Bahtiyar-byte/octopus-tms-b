package tms.octopus.octopus_tms.core.auth.model;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.List;
import lombok.Getter;
import lombok.Setter;
import tms.octopus.octopus_tms.core.company.model.CompanyDTO;
import tms.octopus.octopus_tms.core.user.model.UserDTO;


@Getter
@Setter
public class UserAuthDTO {

    @NotNull
    @Size(max = 500)
    private String token;

    @NotNull
    @Size(max = 500)
    private String refreshToken;

    @NotNull
    private LocalDateTime tokenExpiry;

    @NotNull
    @Valid
    private UserDTO user;

    @Valid
    private CompanyDTO company;

    @NotNull
    private List<@Size(max = 255) String> permissions;

}
