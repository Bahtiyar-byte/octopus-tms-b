package tms.octopus.octopus_tms.financial.invoice_line_item.rest;

import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tms.octopus.octopus_tms.base.user.model.UserRole;
import tms.octopus.octopus_tms.financial.invoice_line_item.model.InvoiceLineItemDTO;
import tms.octopus.octopus_tms.financial.invoice_line_item.service.InvoiceLineItemService;


@RestController
@RequestMapping(value = "/api/invoiceLineItems", produces = MediaType.APPLICATION_JSON_VALUE)
@PreAuthorize("hasAnyAuthority('" + UserRole.Fields.ADMIN + "', '" + UserRole.Fields.SALES_REP + "')")
@SecurityRequirement(name = "bearer-jwt")
public class InvoiceLineItemResource {

    private final InvoiceLineItemService invoiceLineItemService;

    public InvoiceLineItemResource(final InvoiceLineItemService invoiceLineItemService) {
        this.invoiceLineItemService = invoiceLineItemService;
    }

    @GetMapping
    public ResponseEntity<List<InvoiceLineItemDTO>> getAllInvoiceLineItems() {
        return ResponseEntity.ok(invoiceLineItemService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<InvoiceLineItemDTO> getInvoiceLineItem(
            @PathVariable(name = "id") final UUID id) {
        return ResponseEntity.ok(invoiceLineItemService.get(id));
    }

    @PostMapping
    @ApiResponse(responseCode = "201")
    public ResponseEntity<UUID> createInvoiceLineItem(
            @RequestBody @Valid final InvoiceLineItemDTO invoiceLineItemDTO) {
        final UUID createdId = invoiceLineItemService.create(invoiceLineItemDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UUID> updateInvoiceLineItem(@PathVariable(name = "id") final UUID id,
            @RequestBody @Valid final InvoiceLineItemDTO invoiceLineItemDTO) {
        invoiceLineItemService.update(id, invoiceLineItemDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    @ApiResponse(responseCode = "204")
    public ResponseEntity<Void> deleteInvoiceLineItem(@PathVariable(name = "id") final UUID id) {
        invoiceLineItemService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
