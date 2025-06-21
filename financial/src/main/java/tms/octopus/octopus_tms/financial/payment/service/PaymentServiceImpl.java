package tms.octopus.octopus_tms.financial.payment.service;

import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import tms.octopus.octopus_tms.base.util.NotFoundException;
import tms.octopus.octopus_tms.financial.invoice.repos.InvoiceRepository;
import tms.octopus.octopus_tms.financial.payment.domain.Payment;
import tms.octopus.octopus_tms.financial.payment.model.PaymentDTO;
import tms.octopus.octopus_tms.financial.payment.repos.PaymentRepository;


@Service
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final InvoiceRepository invoiceRepository;
    private final PaymentMapper paymentMapper;

    public PaymentServiceImpl(final PaymentRepository paymentRepository,
            final InvoiceRepository invoiceRepository, final PaymentMapper paymentMapper) {
        this.paymentRepository = paymentRepository;
        this.invoiceRepository = invoiceRepository;
        this.paymentMapper = paymentMapper;
    }

    @Override
    public Page<PaymentDTO> findAll(final String filter, final Pageable pageable) {
        Page<Payment> page;
        if (filter != null) {
            UUID uuidFilter = null;
            try {
                uuidFilter = UUID.fromString(filter);
            } catch (final IllegalArgumentException illegalArgumentException) {
                // keep null - no parseable input
            }
            page = paymentRepository.findAllById(uuidFilter, pageable);
        } else {
            page = paymentRepository.findAll(pageable);
        }
        return new PageImpl<>(page.getContent()
                .stream()
                .map(payment -> paymentMapper.updatePaymentDTO(payment, new PaymentDTO()))
                .toList(),
                pageable, page.getTotalElements());
    }

    @Override
    public PaymentDTO get(final UUID id) {
        return paymentRepository.findById(id)
                .map(payment -> paymentMapper.updatePaymentDTO(payment, new PaymentDTO()))
                .orElseThrow(NotFoundException::new);
    }

    @Override
    public UUID create(final PaymentDTO paymentDTO) {
        final Payment payment = new Payment();
        paymentMapper.updatePayment(paymentDTO, payment, invoiceRepository);
        return paymentRepository.save(payment).getId();
    }

    @Override
    public void update(final UUID id, final PaymentDTO paymentDTO) {
        final Payment payment = paymentRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        paymentMapper.updatePayment(paymentDTO, payment, invoiceRepository);
        paymentRepository.save(payment);
    }

    @Override
    public void delete(final UUID id) {
        paymentRepository.deleteById(id);
    }

}
