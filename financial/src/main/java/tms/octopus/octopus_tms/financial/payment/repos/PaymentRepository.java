package tms.octopus.octopus_tms.financial.payment.repos;

import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import tms.octopus.octopus_tms.financial.invoice.domain.Invoice;
import tms.octopus.octopus_tms.financial.payment.domain.Payment;


public interface PaymentRepository extends JpaRepository<Payment, UUID> {

    Page<Payment> findAllById(UUID id, Pageable pageable);

    Payment findFirstByInvoice(Invoice invoice);

}
