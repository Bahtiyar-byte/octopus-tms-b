package tms.octopus.octopus_tms.financial.invoice_line_item.service;

import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import tms.octopus.octopus_tms.base.util.NotFoundException;
import tms.octopus.octopus_tms.financial.invoice.repos.InvoiceRepository;
import tms.octopus.octopus_tms.financial.invoice_line_item.domain.InvoiceLineItem;
import tms.octopus.octopus_tms.financial.invoice_line_item.model.InvoiceLineItemDTO;
import tms.octopus.octopus_tms.financial.invoice_line_item.repos.InvoiceLineItemRepository;


@Service
public class InvoiceLineItemServiceImpl implements InvoiceLineItemService {

    private final InvoiceLineItemRepository invoiceLineItemRepository;
    private final InvoiceRepository invoiceRepository;
    private final InvoiceLineItemMapper invoiceLineItemMapper;

    public InvoiceLineItemServiceImpl(final InvoiceLineItemRepository invoiceLineItemRepository,
            final InvoiceRepository invoiceRepository,
            final InvoiceLineItemMapper invoiceLineItemMapper) {
        this.invoiceLineItemRepository = invoiceLineItemRepository;
        this.invoiceRepository = invoiceRepository;
        this.invoiceLineItemMapper = invoiceLineItemMapper;
    }

    @Override
    public List<InvoiceLineItemDTO> findAll() {
        final List<InvoiceLineItem> invoiceLineItems = invoiceLineItemRepository.findAll(Sort.by("id"));
        return invoiceLineItems.stream()
                .map(invoiceLineItem -> invoiceLineItemMapper.updateInvoiceLineItemDTO(invoiceLineItem, new InvoiceLineItemDTO()))
                .toList();
    }

    @Override
    public InvoiceLineItemDTO get(final UUID id) {
        return invoiceLineItemRepository.findById(id)
                .map(invoiceLineItem -> invoiceLineItemMapper.updateInvoiceLineItemDTO(invoiceLineItem, new InvoiceLineItemDTO()))
                .orElseThrow(NotFoundException::new);
    }

    @Override
    public UUID create(final InvoiceLineItemDTO invoiceLineItemDTO) {
        final InvoiceLineItem invoiceLineItem = new InvoiceLineItem();
        invoiceLineItemMapper.updateInvoiceLineItem(invoiceLineItemDTO, invoiceLineItem, invoiceRepository);
        return invoiceLineItemRepository.save(invoiceLineItem).getId();
    }

    @Override
    public void update(final UUID id, final InvoiceLineItemDTO invoiceLineItemDTO) {
        final InvoiceLineItem invoiceLineItem = invoiceLineItemRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        invoiceLineItemMapper.updateInvoiceLineItem(invoiceLineItemDTO, invoiceLineItem, invoiceRepository);
        invoiceLineItemRepository.save(invoiceLineItem);
    }

    @Override
    public void delete(final UUID id) {
        invoiceLineItemRepository.deleteById(id);
    }

}
