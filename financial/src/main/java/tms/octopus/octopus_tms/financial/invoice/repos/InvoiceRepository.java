package tms.octopus.octopus_tms.financial.invoice.repos;

import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import tms.octopus.octopus_tms.financial.invoice.domain.Invoice;


public interface InvoiceRepository extends JpaRepository<Invoice, UUID> {

    Page<Invoice> findAllById(UUID id, Pageable pageable);

}
