package tms.octopus.octopus_tms.core.auth.service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.JWTVerifier;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import tms.octopus.octopus_tms.core.user.domain.User;
import tms.octopus.octopus_tms.core.user.repos.UserRepository;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class RefreshTokenService {
    
    private final UserRepository userRepository;
    
    @Value("${jwt.refresh.secret:octopus-tms-refresh-secret-key-2025}")
    private String refreshSecret;
    
    @Value("${jwt.refresh.expiration:604800}") // 7 days in seconds
    private Long refreshExpiration;
    
    /**
     * Generate a refresh token for the user
     */
    public String generateRefreshToken(User user) {
        Algorithm algorithm = Algorithm.HMAC512(refreshSecret);
        
        return JWT.create()
                .withSubject(user.getUsername())
                .withClaim("userId", user.getId().toString())
                .withClaim("tokenType", "refresh")
                .withClaim("jti", UUID.randomUUID().toString()) // Unique token ID for rotation
                .withExpiresAt(Date.from(Instant.now().plus(refreshExpiration, ChronoUnit.SECONDS)))
                .withIssuedAt(Date.from(Instant.now()))
                .sign(algorithm);
    }
    
    /**
     * Validate refresh token and return the user if valid
     */
    public User validateRefreshToken(String refreshToken) {
        try {
            Algorithm algorithm = Algorithm.HMAC512(refreshSecret);
            JWTVerifier verifier = JWT.require(algorithm)
                    .withClaim("tokenType", "refresh")
                    .build();
            
            DecodedJWT decodedJWT = verifier.verify(refreshToken);
            String userId = decodedJWT.getClaim("userId").asString();
            
            if (userId == null) {
                log.warn("Refresh token missing userId claim");
                return null;
            }
            
            return userRepository.findById(UUID.fromString(userId))
                    .orElse(null);
                    
        } catch (JWTVerificationException e) {
            log.warn("Invalid refresh token: {}", e.getMessage());
            return null;
        } catch (Exception e) {
            log.error("Error validating refresh token", e);
            return null;
        }
    }
}