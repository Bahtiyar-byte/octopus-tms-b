package tms.octopus.octopus_tms.financial.payment.service;

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
import tms.octopus.octopus_tms.financial.payment.domain.Payment;
import tms.octopus.octopus_tms.financial.payment.model.PaymentDTO;


@Mapper(
        componentModel = MappingConstants.ComponentModel.SPRING,
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface PaymentMapper {

    @Mapping(target = "invoice", ignore = true)
    PaymentDTO updatePaymentDTO(Payment payment, @MappingTarget PaymentDTO paymentDTO);

    @AfterMapping
    default void afterUpdatePaymentDTO(Payment payment, @MappingTarget PaymentDTO paymentDTO) {
        paymentDTO.setInvoice(payment.getInvoice() == null ? null : payment.getInvoice().getId());
    }

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "invoice", ignore = true)
    Payment updatePayment(PaymentDTO paymentDTO, @MappingTarget Payment payment,
            @Context InvoiceRepository invoiceRepository);

    @AfterMapping
    default void afterUpdatePayment(PaymentDTO paymentDTO, @MappingTarget Payment payment,
            @Context InvoiceRepository invoiceRepository) {
        final Invoice invoice = paymentDTO.getInvoice() == null ? null : invoiceRepository.findById(paymentDTO.getInvoice())
                .orElseThrow(() -> new NotFoundException("invoice not found"));
        payment.setInvoice(invoice);
    }

}
