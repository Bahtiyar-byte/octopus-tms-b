package tms.octopus.octopus_tms.core.service;

import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import tms.octopus.octopus_tms.base.user.model.UserRole;
import tms.octopus.octopus_tms.core.model.OctopusTMSSecurityConfigUserDetails;
import tms.octopus.octopus_tms.core.user.domain.User;
import tms.octopus.octopus_tms.core.user.repos.UserRepository;


@Service
@Slf4j
public class OctopusTMSSecurityConfigUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public OctopusTMSSecurityConfigUserDetailsService(final UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public OctopusTMSSecurityConfigUserDetails loadUserByUsername(final String username) {
        final User user = userRepository.findByUsernameIgnoreCase(username);
        if (user == null) {
            log.warn("user not found: {}", username);
            throw new UsernameNotFoundException("User " + username + " not found");
        }
        // Get the actual role from the user entity
        final String role = user.getRole() != null ? user.getRole().name() : UserRole.ADMIN.name();
        final List<SimpleGrantedAuthority> authorities = List.of(new SimpleGrantedAuthority(role));
        return new OctopusTMSSecurityConfigUserDetails(user.getId(), username, user.getPasswordHash(), authorities);
    }

}
