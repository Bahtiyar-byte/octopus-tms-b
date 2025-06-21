package tms.octopus.octopus_tms.financial.invoice_operations.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.List;
import lombok.Getter;
import lombok.Setter;
import tms.octopus.octopus_tms.core.company.model.CompanyDTO;
import tms.octopus.octopus_tms.financial.invoice.model.InvoiceDTO;
import tms.octopus.octopus_tms.financial.invoice_line_item.model.InvoiceLineItemDTO;
import tms.octopus.octopus_tms.financial.payment.model.PaymentDTO;
import tms.octopus.octopus_tms.load.load.model.LoadDTO;


@Getter
@Setter
public class InvoiceDetailDTO {

    @NotNull
    @Valid
    private InvoiceDTO invoice;

    @NotNull
    @Valid
    private List<InvoiceLineItemDTO> lineItems;

    @Valid
    private List<PaymentDTO> payments;

    @NotNull
    @Valid
    private CompanyDTO company;

    @Valid
    private LoadDTO load;

    @NotNull
    @Digits(integer = 10, fraction = 2)
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    @Schema(type = "string", example = "72.08")
    private BigDecimal totalPaid;

    @NotNull
    @Digits(integer = 10, fraction = 2)
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    @Schema(type = "string", example = "72.08")
    private BigDecimal balanceDue;

    private Integer daysOverdue;

}
