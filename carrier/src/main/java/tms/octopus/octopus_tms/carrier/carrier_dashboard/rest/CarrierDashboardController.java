package tms.octopus.octopus_tms.carrier.carrier_dashboard.rest;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import java.util.Map;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tms.octopus.octopus_tms.base.user.model.UserRole;


@RestController
@RequestMapping(value = "/dashboard", produces = MediaType.APPLICATION_JSON_VALUE)
@PreAuthorize("hasAnyAuthority('" + UserRole.Fields.ADMIN + "', '" + UserRole.Fields.SALES_REP + "')")
@SecurityRequirement(name = "bearer-jwt")
public class CarrierDashboardController {

    @GetMapping("/carrier")
    public ResponseEntity<Map<String, String>> getCarrierDashboard() {
        return ResponseEntity.ok(null);
    }

}
