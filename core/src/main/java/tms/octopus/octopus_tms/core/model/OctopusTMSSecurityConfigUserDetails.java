package tms.octopus.octopus_tms.core.model;

import java.util.Collection;
import java.util.UUID;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;


/**
 * Extension of Spring Security User class to store additional data.
 */
@Getter
public class OctopusTMSSecurityConfigUserDetails extends User {

    private final UUID id;

    public OctopusTMSSecurityConfigUserDetails(final UUID id, final String username,
            final String hash, final Collection<? extends GrantedAuthority> authorities) {
        super(username, hash, authorities);
        this.id = id;
    }

}
