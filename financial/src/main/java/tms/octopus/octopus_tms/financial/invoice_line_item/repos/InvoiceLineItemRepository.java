package tms.octopus.octopus_tms.financial.invoice_line_item.repos;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import tms.octopus.octopus_tms.financial.invoice.domain.Invoice;
import tms.octopus.octopus_tms.financial.invoice_line_item.domain.InvoiceLineItem;


public interface InvoiceLineItemRepository extends JpaRepository<InvoiceLineItem, UUID> {

    InvoiceLineItem findFirstByInvoice(Invoice invoice);

}
