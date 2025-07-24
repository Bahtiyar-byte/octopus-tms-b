package tms.octopus.octopus_tms.core.rest;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.server.ResponseStatusException;
import tms.octopus.octopus_tms.core.model.AuthenticationRequest;
import tms.octopus.octopus_tms.core.model.AuthenticationResponse;
import tms.octopus.octopus_tms.core.model.OctopusTMSSecurityConfigUserDetails;
import tms.octopus.octopus_tms.core.service.OctopusTMSSecurityConfigTokenService;
import tms.octopus.octopus_tms.core.service.OctopusTMSSecurityConfigUserDetailsService;
import tms.octopus.octopus_tms.core.auth.service.RefreshTokenService;
import tms.octopus.octopus_tms.core.user.repos.UserRepository;


@RestController
public class AuthenticationResource {

    private final AuthenticationManager authenticationManager;
    private final OctopusTMSSecurityConfigUserDetailsService octopusTMSSecurityConfigUserDetailsService;
    private final OctopusTMSSecurityConfigTokenService octopusTMSSecurityConfigTokenService;
    private final RefreshTokenService refreshTokenService;
    private final UserRepository userRepository;

    public AuthenticationResource(final AuthenticationManager authenticationManager,
            final OctopusTMSSecurityConfigUserDetailsService octopusTMSSecurityConfigUserDetailsService,
            final OctopusTMSSecurityConfigTokenService octopusTMSSecurityConfigTokenService,
            final RefreshTokenService refreshTokenService,
            final UserRepository userRepository) {
        this.authenticationManager = authenticationManager;
        this.octopusTMSSecurityConfigUserDetailsService = octopusTMSSecurityConfigUserDetailsService;
        this.octopusTMSSecurityConfigTokenService = octopusTMSSecurityConfigTokenService;
        this.refreshTokenService = refreshTokenService;
        this.userRepository = userRepository;
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
        
        // Generate refresh token
        final var user = userRepository.findByUsernameIgnoreCase(authenticationRequest.getUsername());
        if (user != null) {
            authenticationResponse.setRefreshToken(refreshTokenService.generateRefreshToken(user));
        }
        
        return authenticationResponse;
    }
    
    @PostMapping("/auth/refresh")
    public AuthenticationResponse refreshToken(
            @RequestBody @Valid final RefreshTokenRequest refreshTokenRequest) {
        // Validate refresh token
        final var user = refreshTokenService.validateRefreshToken(refreshTokenRequest.getRefreshToken());
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid refresh token");
        }
        
        // Generate new access token
        final OctopusTMSSecurityConfigUserDetails userDetails = octopusTMSSecurityConfigUserDetailsService.loadUserByUsername(user.getUsername());
        final AuthenticationResponse authenticationResponse = new AuthenticationResponse();
        authenticationResponse.setAccessToken(octopusTMSSecurityConfigTokenService.generateToken(userDetails));
        authenticationResponse.setRefreshToken(refreshTokenRequest.getRefreshToken()); // Return same refresh token
        
        return authenticationResponse;
    }
    
    public static class RefreshTokenRequest {
        @jakarta.validation.constraints.NotNull
        private String refreshToken;
        
        public String getRefreshToken() {
            return refreshToken;
        }
        
        public void setRefreshToken(String refreshToken) {
            this.refreshToken = refreshToken;
        }
    }

}
