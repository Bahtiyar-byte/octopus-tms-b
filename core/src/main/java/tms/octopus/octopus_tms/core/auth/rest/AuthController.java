package tms.octopus.octopus_tms.core.auth.rest;

import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tms.octopus.octopus_tms.base.user.model.UserRole;
import tms.octopus.octopus_tms.core.auth.model.LoginRequestDTO;
import tms.octopus.octopus_tms.core.auth.model.RefreshTokenRequestDTO;
import tms.octopus.octopus_tms.core.auth.model.UserAuthDTO;
import tms.octopus.octopus_tms.core.auth.service.AuthService;
import tms.octopus.octopus_tms.core.user.model.UserDTO;


@RestController
@RequestMapping(value = "/auth", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<UserAuthDTO> login(
            @RequestBody @Valid final LoginRequestDTO loginRequestDTO) {
        return ResponseEntity.ok(authService.authenticate(loginRequestDTO));
    }

    @PostMapping("/logout")
    @PreAuthorize("hasAnyAuthority('" + UserRole.Fields.SUPERVISOR + "', '" + UserRole.Fields.DISPATCHER + "', '" + UserRole.Fields.DRIVER + "', '" + UserRole.Fields.ACCOUNTING + "')")
    @SecurityRequirement(name = "bearer-jwt")
    @ApiResponse(responseCode = "204")
    public ResponseEntity<Void> logout() {
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PostMapping("/refresh")
    @PreAuthorize("hasAnyAuthority('" + UserRole.Fields.SUPERVISOR + "', '" + UserRole.Fields.DISPATCHER + "', '" + UserRole.Fields.DRIVER + "', '" + UserRole.Fields.ACCOUNTING + "')")
    @SecurityRequirement(name = "bearer-jwt")
    public ResponseEntity<UserAuthDTO> refreshToken(
            @RequestBody @Valid final RefreshTokenRequestDTO refreshTokenRequestDTO) {
        return ResponseEntity.ok(null);
    }

    @GetMapping("/me")
    @PreAuthorize("hasAnyAuthority('" + UserRole.Fields.SUPERVISOR + "', '" + UserRole.Fields.DISPATCHER + "', '" + UserRole.Fields.DRIVER + "', '" + UserRole.Fields.ACCOUNTING + "')")
    @SecurityRequirement(name = "bearer-jwt")
    public ResponseEntity<UserDTO> getCurrentUser() {
        return ResponseEntity.ok(null);
    }

}
