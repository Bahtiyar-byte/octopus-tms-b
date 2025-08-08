package tms.octopus.octopus_tms.core.auth.rest;

import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tms.octopus.octopus_tms.core.auth.model.LoginRequestDTO;
import tms.octopus.octopus_tms.core.auth.model.RefreshTokenRequestDTO;
import tms.octopus.octopus_tms.core.auth.model.UserAuthDTO;
import tms.octopus.octopus_tms.core.auth.service.AuthService;
import tms.octopus.octopus_tms.core.security.SecurityService;
import tms.octopus.octopus_tms.core.security.annotations.RequireAdminOrSalesRep;
import tms.octopus.octopus_tms.core.user.model.UserDTO;
import tms.octopus.octopus_tms.core.user.service.UserMapper;


@RestController
@RequestMapping(value = "/auth", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final SecurityService securityService;
    private final UserMapper userMapper;

    @PostMapping("/login")
    public ResponseEntity<UserAuthDTO> login(@RequestBody @Valid final LoginRequestDTO loginRequestDTO) {
        return ResponseEntity.ok(authService.authenticate(loginRequestDTO));
    }

    @PostMapping("/logout")
    @RequireAdminOrSalesRep
    @SecurityRequirement(name = "bearer-jwt")
    @ApiResponse(responseCode = "204")
    public ResponseEntity<Void> logout() {
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PostMapping("/refresh")
    public ResponseEntity<UserAuthDTO> refreshToken(
            @RequestBody @Valid final RefreshTokenRequestDTO refreshTokenRequestDTO) {
        UserAuthDTO response = authService.refreshAccessToken(refreshTokenRequestDTO.getRefreshToken());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    @RequireAdminOrSalesRep
    @SecurityRequirement(name = "bearer-jwt")
    public ResponseEntity<UserDTO> getCurrentUser() {
        var currentUser = securityService.getCurrentUser();
        if (currentUser == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(userMapper.toDto(currentUser));
    }

}
