package tms.octopus.octopus_tms.core.auth.service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import tms.octopus.octopus_tms.core.auth.model.LoginRequestDTO;
import tms.octopus.octopus_tms.core.auth.model.UserAuthDTO;
import tms.octopus.octopus_tms.core.user.domain.User;
import tms.octopus.octopus_tms.core.user.model.UserDTO;
import tms.octopus.octopus_tms.core.user.repos.UserRepository;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Value("${jwt.secret:octopus-tms-secret-key-2025}")
    private String jwtSecret;
    
    @Value("${jwt.expiration:86400}")
    private Long jwtExpiration;

    public UserAuthDTO authenticate(LoginRequestDTO loginRequest) {
        // Find user by username (email)
        User user = userRepository.findByUsernameIgnoreCase(loginRequest.getUsername());
        if (user == null) {
            throw new RuntimeException("Invalid credentials");
        }
        
        // Verify password
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid credentials");
        }
        
        // Generate JWT token
        String token = generateToken(user);
        
        // Create response
        UserAuthDTO response = new UserAuthDTO();
        response.setToken(token);
        response.setRefreshToken(token); // Same as token for now
        response.setTokenExpiry(java.time.LocalDateTime.now().plusSeconds(jwtExpiration));
        
        // Create UserDTO
        UserDTO userDto = new UserDTO();
        userDto.setId(user.getId());
        userDto.setUsername(user.getUsername());
        userDto.setRole(user.getRole());
        userDto.setFirstName(user.getFirstName());
        userDto.setLastName(user.getLastName());
        response.setUser(userDto);
        
        // Set permissions based on role
        response.setPermissions(List.of(user.getRole().name()));
        
        return response;
    }
    
    private String generateToken(User user) {
        Algorithm algorithm = Algorithm.HMAC256(jwtSecret);
        
        return JWT.create()
                .withSubject(user.getUsername())
                .withClaim("userId", user.getId().toString())
                .withClaim("roles", List.of(user.getRole().name()))
                .withExpiresAt(Date.from(Instant.now().plus(jwtExpiration, ChronoUnit.SECONDS)))
                .withIssuedAt(Date.from(Instant.now()))
                .sign(algorithm);
    }
}