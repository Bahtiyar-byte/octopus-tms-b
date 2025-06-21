package tms.octopus.octopus_tms.financial.invoice.service;

import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import tms.octopus.octopus_tms.base.util.ReferencedWarning;
import tms.octopus.octopus_tms.financial.invoice.model.InvoiceDTO;


public interface InvoiceService {

    Page<InvoiceDTO> findAll(String filter, Pageable pageable);

    InvoiceDTO get(UUID id);

    UUID create(InvoiceDTO invoiceDTO);

    void update(UUID id, InvoiceDTO invoiceDTO);

    void delete(UUID id);

    ReferencedWarning getReferencedWarning(UUID id);

}
