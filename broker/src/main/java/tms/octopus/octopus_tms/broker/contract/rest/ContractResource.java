package tms.octopus.octopus_tms.broker.contract.rest;

import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import tms.octopus.octopus_tms.broker.contract.model.ContractDTO;
import tms.octopus.octopus_tms.broker.contract.service.ContractService;
import tms.octopus.octopus_tms.core.security.annotations.RequireBrokerAccess;
import tms.octopus.octopus_tms.core.security.annotations.RequireAdminOrSalesRep;


@RestController
@RequestMapping(value = "/api/contracts", produces = MediaType.APPLICATION_JSON_VALUE)
@RequireBrokerAccess
@RequireAdminOrSalesRep
@SecurityRequirement(name = "bearer-jwt")
public class ContractResource {

    private final ContractService contractService;

    public ContractResource(final ContractService contractService) {
        this.contractService = contractService;
    }

    @GetMapping
    public ResponseEntity<List<ContractDTO>> getAllContracts(
            @RequestParam(name = "filter", required = false) final String filter) {
        return ResponseEntity.ok(contractService.findAll(filter));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContractDTO> getContract(@PathVariable(name = "id") final UUID id) {
        return ResponseEntity.ok(contractService.get(id));
    }

    @PostMapping
    @ApiResponse(responseCode = "201")
    public ResponseEntity<UUID> createContract(@RequestBody @Valid final ContractDTO contractDTO) {
        final UUID createdId = contractService.create(contractDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UUID> updateContract(@PathVariable(name = "id") final UUID id,
            @RequestBody @Valid final ContractDTO contractDTO) {
        contractService.update(id, contractDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    @ApiResponse(responseCode = "204")
    public ResponseEntity<Void> deleteContract(@PathVariable(name = "id") final UUID id) {
        contractService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
