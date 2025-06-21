package tms.octopus.octopus_tms.financial.invoice_operations.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class InvoiceSendRequestDTO {

    @NotNull
    @Size(max = 255)
    private String recipientEmail;

    private List<@Size(max = 255) String> ccEmails;

    @Size(max = 500)
    private String subject;

    private String message;

    private Boolean includeBackupDocuments;

}
