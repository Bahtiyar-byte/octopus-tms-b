package tms.octopus.octopus_tms.carrier.driver_report.rest;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import tms.octopus.octopus_tms.base.user.model.UserRole;
import tms.octopus.octopus_tms.carrier.driver_report.model.DriverStatusDTO;


@RestController
@RequestMapping(value = "/reports", produces = MediaType.APPLICATION_JSON_VALUE)
@PreAuthorize("hasAuthority('" + UserRole.Fields.SUPERVISOR + "')")
@SecurityRequirement(name = "bearer-jwt")
public class DeriverReportController {

    @GetMapping("/performance/{driverId}")
    public ResponseEntity<DriverStatusDTO> getDriverPerformance(
            @PathVariable(name = "driverId") final String driverId,
            @RequestParam(name = "startDate", required = false) final String startDate,
            @RequestParam(name = "endDate", required = false) final String endDate) {
        return ResponseEntity.ok(null);
    }

}
