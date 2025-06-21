package tms.octopus.octopus_tms.financial.payment.model;

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
import tms.octopus.octopus_tms.base.payment.model.PaymentMethod;


@Getter
@Setter
public class PaymentDTO {

    private UUID id;

    @NotNull
    private UUID companyId;

    @Size(max = 50)
    private String paymentNumber;

    @NotNull
    @Digits(integer = 10, fraction = 2)
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    @Schema(type = "string", example = "92.08")
    private BigDecimal amount;

    private PaymentMethod paymentMethod;

    private LocalDate paymentDate;

    @Size(max = 100)
    private String referenceNumber;

    @Size(max = 50)
    private String status;

    @Size(max = 50)
    private String processor;

    @Size(max = 100)
    private String processorReference;

    private String notes;

    private UUID createdBy;

    private OffsetDateTime createdAt;

    private OffsetDateTime updatedAt;

    private UUID invoice;

}
