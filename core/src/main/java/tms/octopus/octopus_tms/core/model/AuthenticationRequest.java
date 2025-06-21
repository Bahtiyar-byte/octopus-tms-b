package tms.octopus.octopus_tms.core.model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import tms.octopus.octopus_tms.base.util.WebUtils;


@Getter
@Setter
public class AuthenticationRequest {

    @NotNull
    @Size(max = 100)
    @Email(regexp = WebUtils.EMAIL_PATTERN)
    private String username;

    @NotNull
    @Size(max = 72)
    private String password;

}
