package tms.octopus.octopus_tms.core.auth.service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
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
    private final RefreshTokenService refreshTokenService;
    
    @Value("${jwt.secret:octopus-tms-secret-key-2025}")
    private String jwtSecret;
    
    @Value("${jwt.expiration:86400}")
    private Long jwtExpiration;

    @Transactional(readOnly = true)
    public UserAuthDTO authenticate(LoginRequestDTO loginRequest) {
        // Find user by username (email) with company eagerly loaded
        User user = userRepository.findByUsernameIgnoreCaseWithCompany(loginRequest.getUsername());
        if (user == null) {
            throw new RuntimeException("Invalid credentials");
        }
        
        // Verify password
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid credentials");
        }
        
        // Generate tokens
        String accessToken = generateAccessToken(user);
        String refreshToken = refreshTokenService.generateRefreshToken(user);
        
        // Create response
        UserAuthDTO response = new UserAuthDTO();
        response.setToken(accessToken);
        response.setRefreshToken(refreshToken);
        response.setTokenExpiry(java.time.LocalDateTime.now().plusSeconds(jwtExpiration));
        
        // Create UserDTO with company information
        UserDTO userDto = new UserDTO();
        userDto.setId(user.getId());
        userDto.setUsername(user.getUsername());
        userDto.setRole(user.getRole());
        userDto.setFirstName(user.getFirstName());
        userDto.setLastName(user.getLastName());
        userDto.setCompanyType(user.getCompanyType());
        if (user.getCompany() != null) {
            userDto.setCompany(user.getCompany().getId());
            userDto.setCompanyName(user.getCompany().getName());
        }
        response.setUser(userDto);
        
        // Set permissions based on role
        response.setPermissions(List.of(user.getRole().name()));
        
        return response;
    }
    
    public String generateAccessToken(User user) {
        Algorithm algorithm = Algorithm.HMAC256(jwtSecret);
        
        return JWT.create()
                .withSubject(user.getUsername())
                .withClaim("userId", user.getId().toString())
                .withClaim("roles", List.of(user.getRole().name()))
                .withClaim("companyId", user.getCompany() != null ? user.getCompany().getId().toString() : null)
                .withClaim("companyName", user.getCompany() != null ? user.getCompany().getName() : null)
                .withClaim("companyType", user.getCompanyType() != null ? user.getCompanyType().name() : null)
                .withExpiresAt(Date.from(Instant.now().plus(jwtExpiration, ChronoUnit.SECONDS)))
                .withIssuedAt(Date.from(Instant.now()))
                .sign(algorithm);
    }
    
    /**
     * Refresh access token using refresh token
     */
    @Transactional(readOnly = true)
    public UserAuthDTO refreshAccessToken(String refreshToken) {
        // Validate refresh token
        User user = refreshTokenService.validateRefreshToken(refreshToken);
        if (user == null) {
            throw new RuntimeException("Invalid refresh token");
        }
        
        // Generate new access token
        String newAccessToken = generateAccessToken(user);
        
        // Create response with new access token and same refresh token
        UserAuthDTO response = new UserAuthDTO();
        response.setToken(newAccessToken);
        response.setRefreshToken(refreshToken); // Keep same refresh token
        response.setTokenExpiry(java.time.LocalDateTime.now().plusSeconds(jwtExpiration));
        
        // Create UserDTO with company information
        UserDTO userDto = new UserDTO();
        userDto.setId(user.getId());
        userDto.setUsername(user.getUsername());
        userDto.setRole(user.getRole());
        userDto.setFirstName(user.getFirstName());
        userDto.setLastName(user.getLastName());
        userDto.setCompanyType(user.getCompanyType());
        if (user.getCompany() != null) {
            userDto.setCompany(user.getCompany().getId());
            userDto.setCompanyName(user.getCompany().getName());
        }
        response.setUser(userDto);
        
        // Set permissions based on role
        response.setPermissions(List.of(user.getRole().name()));
        
        return response;
    }
}