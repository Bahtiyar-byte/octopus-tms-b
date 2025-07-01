package tms.octopus.octopus_tms.shipper.warehouse.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;
import tms.octopus.octopus_tms.shipper.inventory_level.domain.InventoryLevel;


@Entity
@Table(name = "Warehouses")
@Getter
@Setter
public class Warehouse {

    @Id
    @Column(nullable = false, updatable = false)
    @GeneratedValue
    @UuidGenerator
    private UUID id;

    @Column
    private UUID companyId;

    @Column(nullable = false)
    private String name;

    @Column(length = 50)
    private String code;

    @Column(length = 500)
    private String address;

    @Column(length = 100)
    private String city;

    @Column(length = 50)
    private String state;

    @Column(length = 20)
    private String zip;

    @Column(precision = 10, scale = 6)
    private BigDecimal latitude;

    @Column(precision = 10, scale = 6)
    private BigDecimal longitude;

    @Column
    private UUID managerId;

    @Column(length = 50)
    private String phone;

    @Column
    private String email;

    @Column(columnDefinition = "text")
    private String operatingHours;

    @Column
    private Integer capacitySqft;

    @Column
    private Integer dockDoors;

    @Column(length = 50)
    private String status;

    @Column
    private OffsetDateTime createdAt;

    @Column
    private OffsetDateTime updatedAt;

    @OneToMany(mappedBy = "warehouse")
    private Set<InventoryLevel> inventoryLevels = new HashSet<>();

}
