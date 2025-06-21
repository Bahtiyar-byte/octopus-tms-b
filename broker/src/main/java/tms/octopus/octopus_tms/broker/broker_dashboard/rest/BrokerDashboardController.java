package tms.octopus.octopus_tms.broker.broker_dashboard.rest;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tms.octopus.octopus_tms.base.user.model.UserRole;
import tms.octopus.octopus_tms.broker.broker_dashboard.model.BrokerDashboardDTO;


@RestController
@RequestMapping(value = "/dashboard", produces = MediaType.APPLICATION_JSON_VALUE)
@PreAuthorize("hasAnyAuthority('" + UserRole.Fields.SUPERVISOR + "', '" + UserRole.Fields.SALES + "')")
@SecurityRequirement(name = "bearer-jwt")
public class BrokerDashboardController {

    @GetMapping("/broker")
    public ResponseEntity<BrokerDashboardDTO> getBrokerDashboard() {
        return ResponseEntity.ok(null);
    }

}
