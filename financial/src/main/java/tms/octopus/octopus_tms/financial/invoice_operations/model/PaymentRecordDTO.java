package tms.octopus.octopus_tms.financial.invoice_operations.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;
import tms.octopus.octopus_tms.base.payment.model.PaymentMethod;


@Getter
@Setter
public class PaymentRecordDTO {

    @NotNull
    @Digits(integer = 10, fraction = 2)
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    @Schema(type = "string", example = "92.08")
    private BigDecimal amount;

    @NotNull
    private PaymentMethod paymentMethod;

    @NotNull
    private LocalDate paymentDate;

    @Size(max = 100)
    private String referenceNumber;

    @Size(max = 100)
    private String processorReference;

    @Size(max = 1000)
    private String notes;

}
