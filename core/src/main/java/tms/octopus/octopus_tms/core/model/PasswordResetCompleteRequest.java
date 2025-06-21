package tms.octopus.octopus_tms.core.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class PasswordResetCompleteRequest {

    @NotNull
    @Size(max = 255)
    private String uid;

    @NotNull
    @Size(max = 255)
    private String newPassword;

}
