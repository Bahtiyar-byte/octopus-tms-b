package tms.octopus.octopus_tms.financial.invoice.service;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;
import tms.octopus.octopus_tms.financial.invoice.domain.Invoice;
import tms.octopus.octopus_tms.financial.invoice.model.InvoiceDTO;


@Mapper(
        componentModel = MappingConstants.ComponentModel.SPRING,
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface InvoiceMapper {

    InvoiceDTO updateInvoiceDTO(Invoice invoice, @MappingTarget InvoiceDTO invoiceDTO);

    @Mapping(target = "id", ignore = true)
    Invoice updateInvoice(InvoiceDTO invoiceDTO, @MappingTarget Invoice invoice);

}
