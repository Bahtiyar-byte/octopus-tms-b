package tms.octopus.octopus_tms.financial.payment.service;

import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import tms.octopus.octopus_tms.financial.payment.model.PaymentDTO;


public interface PaymentService {

    Page<PaymentDTO> findAll(String filter, Pageable pageable);

    PaymentDTO get(UUID id);

    UUID create(PaymentDTO paymentDTO);

    void update(UUID id, PaymentDTO paymentDTO);

    void delete(UUID id);

}
