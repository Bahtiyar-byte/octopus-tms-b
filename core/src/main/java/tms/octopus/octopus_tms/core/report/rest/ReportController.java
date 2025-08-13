package tms.octopus.octopus_tms.core.report.rest;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import java.util.Map;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import tms.octopus.octopus_tms.base.user.model.UserRole;


@RestController
@RequestMapping(value = "/reports", produces = MediaType.APPLICATION_JSON_VALUE)
@SecurityRequirement(name = "bearer-jwt")
public class ReportController {

    @GetMapping("/revenue")
    @PreAuthorize("hasAnyAuthority('" + UserRole.Fields.ADMIN + "')")
    public ResponseEntity<Map<String, String>> getRevenueReport(
            @RequestParam(name = "startDate", required = false) final String startDate,
            @RequestParam(name = "endDate", required = false) final String endDate,
            @RequestParam(name = "groupBy", required = false) final String groupBy) {
        return ResponseEntity.ok(null);
    }

    @GetMapping("/loads/summary")
    @PreAuthorize("hasAnyAuthority('" + UserRole.Fields.ADMIN + "', '" + UserRole.Fields.SALES_REP + "')")
    public ResponseEntity<Map<String, String>> getLoadsSummary(
            @RequestParam(name = "period", required = false) final String period) {
        return ResponseEntity.ok(null);
    }

}
