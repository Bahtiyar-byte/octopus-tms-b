package tms.octopus.octopus_tms.core.rest;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import tms.octopus.octopus_tms.core.model.AuthenticationRequest;
import tms.octopus.octopus_tms.core.model.AuthenticationResponse;
import tms.octopus.octopus_tms.core.model.OctopusTMSSecurityConfigUserDetails;
import tms.octopus.octopus_tms.core.service.OctopusTMSSecurityConfigTokenService;
import tms.octopus.octopus_tms.core.service.OctopusTMSSecurityConfigUserDetailsService;


@RestController
public class AuthenticationResource {

    private final AuthenticationManager authenticationManager;
    private final OctopusTMSSecurityConfigUserDetailsService octopusTMSSecurityConfigUserDetailsService;
    private final OctopusTMSSecurityConfigTokenService octopusTMSSecurityConfigTokenService;

    public AuthenticationResource(final AuthenticationManager authenticationManager,
            final OctopusTMSSecurityConfigUserDetailsService octopusTMSSecurityConfigUserDetailsService,
            final OctopusTMSSecurityConfigTokenService octopusTMSSecurityConfigTokenService) {
        this.authenticationManager = authenticationManager;
        this.octopusTMSSecurityConfigUserDetailsService = octopusTMSSecurityConfigUserDetailsService;
        this.octopusTMSSecurityConfigTokenService = octopusTMSSecurityConfigTokenService;
    }

    @PostMapping("/authenticate")
    public AuthenticationResponse authenticate(
            @RequestBody @Valid final AuthenticationRequest authenticationRequest) {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                    authenticationRequest.getUsername(), authenticationRequest.getPassword()));
        } catch (final BadCredentialsException ex) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }

        final OctopusTMSSecurityConfigUserDetails userDetails = octopusTMSSecurityConfigUserDetailsService.loadUserByUsername(authenticationRequest.getUsername());
        final AuthenticationResponse authenticationResponse = new AuthenticationResponse();
        authenticationResponse.setAccessToken(octopusTMSSecurityConfigTokenService.generateToken(userDetails));
        return authenticationResponse;
    }

}
