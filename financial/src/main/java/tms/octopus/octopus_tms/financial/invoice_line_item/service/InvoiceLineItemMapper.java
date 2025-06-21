package tms.octopus.octopus_tms.financial.invoice_line_item.service;

import org.mapstruct.AfterMapping;
import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;
import tms.octopus.octopus_tms.base.util.NotFoundException;
import tms.octopus.octopus_tms.financial.invoice.domain.Invoice;
import tms.octopus.octopus_tms.financial.invoice.repos.InvoiceRepository;
import tms.octopus.octopus_tms.financial.invoice_line_item.domain.InvoiceLineItem;
import tms.octopus.octopus_tms.financial.invoice_line_item.model.InvoiceLineItemDTO;


@Mapper(
        componentModel = MappingConstants.ComponentModel.SPRING,
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface InvoiceLineItemMapper {

    @Mapping(target = "invoice", ignore = true)
    InvoiceLineItemDTO updateInvoiceLineItemDTO(InvoiceLineItem invoiceLineItem,
            @MappingTarget InvoiceLineItemDTO invoiceLineItemDTO);

    @AfterMapping
    default void afterUpdateInvoiceLineItemDTO(InvoiceLineItem invoiceLineItem,
            @MappingTarget InvoiceLineItemDTO invoiceLineItemDTO) {
        invoiceLineItemDTO.setInvoice(invoiceLineItem.getInvoice() == null ? null : invoiceLineItem.getInvoice().getId());
    }

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "invoice", ignore = true)
    InvoiceLineItem updateInvoiceLineItem(InvoiceLineItemDTO invoiceLineItemDTO,
            @MappingTarget InvoiceLineItem invoiceLineItem,
            @Context InvoiceRepository invoiceRepository);

    @AfterMapping
    default void afterUpdateInvoiceLineItem(InvoiceLineItemDTO invoiceLineItemDTO,
            @MappingTarget InvoiceLineItem invoiceLineItem,
            @Context InvoiceRepository invoiceRepository) {
        final Invoice invoice = invoiceLineItemDTO.getInvoice() == null ? null : invoiceRepository.findById(invoiceLineItemDTO.getInvoice())
                .orElseThrow(() -> new NotFoundException("invoice not found"));
        invoiceLineItem.setInvoice(invoice);
    }

}
