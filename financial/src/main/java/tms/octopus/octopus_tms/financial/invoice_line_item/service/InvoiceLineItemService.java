package tms.octopus.octopus_tms.financial.invoice_line_item.service;

import java.util.List;
import java.util.UUID;
import tms.octopus.octopus_tms.financial.invoice_line_item.model.InvoiceLineItemDTO;


public interface InvoiceLineItemService {

    List<InvoiceLineItemDTO> findAll();

    InvoiceLineItemDTO get(UUID id);

    UUID create(InvoiceLineItemDTO invoiceLineItemDTO);

    void update(UUID id, InvoiceLineItemDTO invoiceLineItemDTO);

    void delete(UUID id);

}
