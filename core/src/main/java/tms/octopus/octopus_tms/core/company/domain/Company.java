package tms.octopus.octopus_tms.core.company.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.Set;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;
import tms.octopus.octopus_tms.base.company.model.CompanyType;
import tms.octopus.octopus_tms.core.user.domain.User;


@Entity
@Table(name = "Companies")
@Getter
@Setter
public class Company {

    @Id
    @Column(nullable = false, updatable = false)
    @GeneratedValue
    @UuidGenerator
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private CompanyType type;

    @Column(length = 50)
    private String mcNumber;

    @Column(length = 50)
    private String dotNumber;

    @Column(length = 50)
    private String ein;

    @Column
    private String addressLine1;

    @Column
    private String addressLine2;

    @Column(length = 100)
    private String city;

    @Column(length = 50)
    private String state;

    @Column(length = 20)
    private String zipCode;

    @Column(length = 50)
    private String country;

    @Column(length = 50)
    private String phone;

    @Column
    private String email;

    @Column
    private String website;

    @Column(length = 500)
    private String logoUrl;

    @Column(length = 50)
    private String status;

    @Column(precision = 10, scale = 2)
    private BigDecimal creditLimit;

    @Column(precision = 10, scale = 2)
    private BigDecimal creditUsed;

    @Column
    private Integer paymentTerms;

    @Column
    private OffsetDateTime createdAt;

    @Column
    private OffsetDateTime updatedAt;

    @OneToMany(mappedBy = "company")
    private Set<User> users;

}
