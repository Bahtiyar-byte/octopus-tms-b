package tms.octopus.octopus_tms.core.service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.JWTVerifier;
import java.time.Duration;
import java.time.Instant;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import tms.octopus.octopus_tms.core.user.domain.User;
import tms.octopus.octopus_tms.core.user.repos.UserRepository;


@Service
@Slf4j
public class OctopusTMSSecurityConfigTokenService {

    private static final Duration JWT_TOKEN_VALIDITY = Duration.ofMinutes(60);

    private final Algorithm hmac512;
    private final JWTVerifier verifier;
    private final UserRepository userRepository;

    public OctopusTMSSecurityConfigTokenService(
            @Value("${octopusTMSSecurityConfig.secret}") final String secret,
            final UserRepository userRepository) {
        this.hmac512 = Algorithm.HMAC512(secret);
        this.verifier = JWT.require(this.hmac512).build();
        this.userRepository = userRepository;
    }

    public String generateToken(final UserDetails userDetails) {
        final Instant now = Instant.now();
        
        // Get the user entity to include more details in the token
        User user = userRepository.findByUsernameIgnoreCase(userDetails.getUsername());
        
        var jwtBuilder = JWT.create()
                .withSubject(userDetails.getUsername())
                // only for client information
                .withArrayClaim("roles", userDetails.getAuthorities().stream()
                        .map(GrantedAuthority::getAuthority)
                        .toArray(String[]::new))
                .withIssuer("app")
                .withIssuedAt(now)
                .withExpiresAt(now.plus(JWT_TOKEN_VALIDITY));
        
        // Add user details if available
        if (user != null) {
            jwtBuilder.withClaim("userId", user.getId().toString())
                    .withClaim("email", user.getEmail())
                    .withClaim("firstName", user.getFirstName())
                    .withClaim("lastName", user.getLastName())
                    .withClaim("role", user.getRole() != null ? user.getRole().name() : null)
                    .withClaim("companyId", user.getCompany() != null ? user.getCompany().getId().toString() : null)
                    .withClaim("companyName", user.getCompany() != null ? user.getCompany().getName() : null)
                    .withClaim("companyType", user.getCompany() != null ? user.getCompany().getType().name() : null);
        }
        
        return jwtBuilder.sign(this.hmac512);
    }

    public DecodedJWT validateToken(final String token) {
        try {
            return verifier.verify(token);
        } catch (final JWTVerificationException verificationEx) {
            log.warn("token invalid: {}", verificationEx.getMessage());
            return null;
        }
    }

}
