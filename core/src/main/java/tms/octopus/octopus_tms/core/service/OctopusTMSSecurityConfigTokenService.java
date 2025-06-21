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


@Service
@Slf4j
public class OctopusTMSSecurityConfigTokenService {

    private static final Duration JWT_TOKEN_VALIDITY = Duration.ofMinutes(60);

    private final Algorithm hmac512;
    private final JWTVerifier verifier;

    public OctopusTMSSecurityConfigTokenService(
            @Value("${octopusTMSSecurityConfig.secret}") final String secret) {
        this.hmac512 = Algorithm.HMAC512(secret);
        this.verifier = JWT.require(this.hmac512).build();
    }

    public String generateToken(final UserDetails userDetails) {
        final Instant now = Instant.now();
        return JWT.create()
                .withSubject(userDetails.getUsername())
                // only for client information
                .withArrayClaim("roles", userDetails.getAuthorities().stream()
                        .map(GrantedAuthority::getAuthority)
                        .toArray(String[]::new))
                .withIssuer("app")
                .withIssuedAt(now)
                .withExpiresAt(now.plus(JWT_TOKEN_VALIDITY))
                .sign(this.hmac512);
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
