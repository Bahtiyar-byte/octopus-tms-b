package tms.octopus.octopus_tms.financial.invoice.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;
import tms.octopus.octopus_tms.base.invoice.model.InvoiceStatus;


@Getter
@Setter
public class InvoiceDTO {

    private UUID id;

    @NotNull
    @Size(max = 50)
    private String invoiceNumber;

    private UUID loadId;

    private UUID companyId;

    @NotNull
    @Size(max = 50)
    private String invoiceType;

    private InvoiceStatus status;

    @NotNull
    @Digits(integer = 10, fraction = 2)
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    @Schema(type = "string", example = "92.08")
    private BigDecimal amount;

    @Digits(integer = 10, fraction = 2)
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    @Schema(type = "string", example = "57.08")
    private BigDecimal taxAmount;

    @NotNull
    @Digits(integer = 10, fraction = 2)
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    @Schema(type = "string", example = "52.08")
    private BigDecimal totalAmount;

    private LocalDate dueDate;

    private LocalDate paidDate;

    @Size(max = 50)
    private String paymentMethod;

    @Size(max = 100)
    private String paymentReference;

    private String notes;

    private UUID createdBy;

    private OffsetDateTime createdAt;

    private OffsetDateTime updatedAt;

}
