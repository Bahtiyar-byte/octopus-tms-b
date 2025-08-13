package tms.octopus.octopus_tms.financial.invoice_operations.rest;

import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tms.octopus.octopus_tms.base.user.model.UserRole;
import tms.octopus.octopus_tms.financial.invoice.model.InvoiceDTO;
import tms.octopus.octopus_tms.financial.invoice_operations.model.InvoiceDetailDTO;
import tms.octopus.octopus_tms.financial.invoice_operations.model.InvoiceSendRequestDTO;
import tms.octopus.octopus_tms.financial.invoice_operations.model.PaymentRecordDTO;
import tms.octopus.octopus_tms.financial.payment.model.PaymentDTO;


@RestController
@RequestMapping(value = "/invoice-operations", produces = MediaType.APPLICATION_JSON_VALUE)
@PreAuthorize("hasAuthority('" + UserRole.Fields.ADMIN + "')")
@SecurityRequirement(name = "bearer-jwt")
public class InvoiceOperationsController {

    @GetMapping("/{invoiceId}/details")
    public ResponseEntity<InvoiceDetailDTO> getInvoiceDetails(
            @PathVariable(name = "invoiceId") final String invoiceId) {
        return ResponseEntity.ok(null);
    }

    @PostMapping("/{invoiceId}/send")
    public ResponseEntity<InvoiceDTO> sendInvoice(
            @PathVariable(name = "invoiceId") final String invoiceId,
            @RequestBody @Valid final InvoiceSendRequestDTO invoiceSendRequestDTO) {
        return ResponseEntity.ok(null);
    }

    @PostMapping("/{invoiceId}/payment")
    @ApiResponse(responseCode = "201")
    public ResponseEntity<PaymentDTO> recordPayment(
            @PathVariable(name = "invoiceId") final String invoiceId,
            @RequestBody @Valid final PaymentRecordDTO paymentRecordDTO) {
        return new ResponseEntity<>(null, HttpStatus.CREATED);
    }

}
