package tms.octopus.octopus_tms.core.config;

import static org.springframework.security.config.Customizer.withDefaults;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import tms.octopus.octopus_tms.core.service.OctopusTMSSecurityConfigTokenService;
import tms.octopus.octopus_tms.core.service.OctopusTMSSecurityConfigUserDetailsService;


@Configuration
@EnableMethodSecurity(prePostEnabled = true)
public class OctopusTMSSecurityConfigSecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        // creates hashes with {bcrypt} prefix
        return PasswordEncoderFactories.createDelegatingPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            final AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    public JwtRequestFilter jwtRequestFilter(
            final OctopusTMSSecurityConfigUserDetailsService octopusTMSSecurityConfigUserDetailsService,
            final OctopusTMSSecurityConfigTokenService octopusTMSSecurityConfigTokenService) {
        return new JwtRequestFilter(octopusTMSSecurityConfigUserDetailsService, octopusTMSSecurityConfigTokenService);
    }

    @Bean
    public SecurityFilterChain octopusTMSSecurityConfigFilterChain(final HttpSecurity http,
            final OctopusTMSSecurityConfigUserDetailsService octopusTMSSecurityConfigUserDetailsService,
            final OctopusTMSSecurityConfigTokenService octopusTMSSecurityConfigTokenService) throws
            Exception {
        return http.cors(withDefaults())
                .csrf(csrf -> csrf.disable())
                .headers(headers -> headers.frameOptions(frameOptions -> frameOptions.sameOrigin()))
                .authorizeHttpRequests(authorize -> authorize.anyRequest().permitAll())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtRequestFilter(octopusTMSSecurityConfigUserDetailsService, octopusTMSSecurityConfigTokenService), UsernamePasswordAuthenticationFilter.class)
                .build();
    }

}
