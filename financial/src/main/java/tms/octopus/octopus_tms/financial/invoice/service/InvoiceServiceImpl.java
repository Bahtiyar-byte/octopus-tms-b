package tms.octopus.octopus_tms.financial.invoice.service;

import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import tms.octopus.octopus_tms.base.util.NotFoundException;
import tms.octopus.octopus_tms.base.util.ReferencedWarning;
import tms.octopus.octopus_tms.financial.invoice.domain.Invoice;
import tms.octopus.octopus_tms.financial.invoice.model.InvoiceDTO;
import tms.octopus.octopus_tms.financial.invoice.repos.InvoiceRepository;
import tms.octopus.octopus_tms.financial.invoice_line_item.domain.InvoiceLineItem;
import tms.octopus.octopus_tms.financial.invoice_line_item.repos.InvoiceLineItemRepository;
import tms.octopus.octopus_tms.financial.payment.domain.Payment;
import tms.octopus.octopus_tms.financial.payment.repos.PaymentRepository;


@Service
public class InvoiceServiceImpl implements InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final InvoiceMapper invoiceMapper;
    private final InvoiceLineItemRepository invoiceLineItemRepository;
    private final PaymentRepository paymentRepository;

    public InvoiceServiceImpl(final InvoiceRepository invoiceRepository,
            final InvoiceMapper invoiceMapper,
            final InvoiceLineItemRepository invoiceLineItemRepository,
            final PaymentRepository paymentRepository) {
        this.invoiceRepository = invoiceRepository;
        this.invoiceMapper = invoiceMapper;
        this.invoiceLineItemRepository = invoiceLineItemRepository;
        this.paymentRepository = paymentRepository;
    }

    @Override
    public Page<InvoiceDTO> findAll(final String filter, final Pageable pageable) {
        Page<Invoice> page;
        if (filter != null) {
            UUID uuidFilter = null;
            try {
                uuidFilter = UUID.fromString(filter);
            } catch (final IllegalArgumentException illegalArgumentException) {
                // keep null - no parseable input
            }
            page = invoiceRepository.findAllById(uuidFilter, pageable);
        } else {
            page = invoiceRepository.findAll(pageable);
        }
        return new PageImpl<>(page.getContent()
                .stream()
                .map(invoice -> invoiceMapper.updateInvoiceDTO(invoice, new InvoiceDTO()))
                .toList(),
                pageable, page.getTotalElements());
    }

    @Override
    public InvoiceDTO get(final UUID id) {
        return invoiceRepository.findById(id)
                .map(invoice -> invoiceMapper.updateInvoiceDTO(invoice, new InvoiceDTO()))
                .orElseThrow(NotFoundException::new);
    }

    @Override
    public UUID create(final InvoiceDTO invoiceDTO) {
        final Invoice invoice = new Invoice();
        invoiceMapper.updateInvoice(invoiceDTO, invoice);
        return invoiceRepository.save(invoice).getId();
    }

    @Override
    public void update(final UUID id, final InvoiceDTO invoiceDTO) {
        final Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        invoiceMapper.updateInvoice(invoiceDTO, invoice);
        invoiceRepository.save(invoice);
    }

    @Override
    public void delete(final UUID id) {
        invoiceRepository.deleteById(id);
    }

    @Override
    public ReferencedWarning getReferencedWarning(final UUID id) {
        final ReferencedWarning referencedWarning = new ReferencedWarning();
        final Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        final InvoiceLineItem invoiceInvoiceLineItem = invoiceLineItemRepository.findFirstByInvoice(invoice);
        if (invoiceInvoiceLineItem != null) {
            referencedWarning.setKey("invoice.invoiceLineItem.invoice.referenced");
            referencedWarning.addParam(invoiceInvoiceLineItem.getId());
            return referencedWarning;
        }
        final Payment invoicePayment = paymentRepository.findFirstByInvoice(invoice);
        if (invoicePayment != null) {
            referencedWarning.setKey("invoice.payment.invoice.referenced");
            referencedWarning.addParam(invoicePayment.getId());
            return referencedWarning;
        }
        return null;
    }

}
