package tms.octopus.octopus_tms.financial.invoice.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.Set;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;
import tms.octopus.octopus_tms.base.invoice.model.InvoiceStatus;
import tms.octopus.octopus_tms.financial.invoice_line_item.domain.InvoiceLineItem;
import tms.octopus.octopus_tms.financial.payment.domain.Payment;


@Entity
@Table(name = "Invoices")
@Getter
@Setter
public class Invoice {

    @Id
    @Column(nullable = false, updatable = false)
    @GeneratedValue
    @UuidGenerator
    private UUID id;

    @Column(nullable = false, length = 50)
    private String invoiceNumber;

    @Column
    private UUID loadId;

    @Column
    private UUID companyId;

    @Column(nullable = false, length = 50)
    private String invoiceType;

    @Column
    @Enumerated(EnumType.STRING)
    private InvoiceStatus status;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(precision = 10, scale = 2)
    private BigDecimal taxAmount;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Column
    private LocalDate dueDate;

    @Column
    private LocalDate paidDate;

    @Column(length = 50)
    private String paymentMethod;

    @Column(length = 100)
    private String paymentReference;

    @Column(columnDefinition = "text")
    private String notes;

    @Column
    private UUID createdBy;

    @Column
    private OffsetDateTime createdAt;

    @Column
    private OffsetDateTime updatedAt;

    @OneToMany(mappedBy = "invoice")
    private Set<InvoiceLineItem> invoiceLineItems;

    @OneToMany(mappedBy = "invoice")
    private Set<Payment> payments;

}
