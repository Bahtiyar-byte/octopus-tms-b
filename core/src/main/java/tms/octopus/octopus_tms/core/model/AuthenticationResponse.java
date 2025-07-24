package tms.octopus.octopus_tms.core.model;

import lombok.Getter;
import lombok.Setter;
import tms.octopus.octopus_tms.base.user.model.UserRole;
import tms.octopus.octopus_tms.base.company.model.CompanyType;


@Getter
@Setter
public class AuthenticationResponse {

    private String accessToken;
    
    private String refreshToken;
    
    private String userId;
    
    private String email;
    
    private String firstName;
    
    private String lastName;
    
    private UserRole role;
    
    private CompanyType companyType;
    
    private String companyName;

}
