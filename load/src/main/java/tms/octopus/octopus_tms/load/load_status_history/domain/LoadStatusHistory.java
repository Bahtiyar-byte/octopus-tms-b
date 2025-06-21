package tms.octopus.octopus_tms.load.load_status_history.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.OffsetDateTime;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;


@Entity
@Table(name = "LoadStatusHistories")
@Getter
@Setter
public class LoadStatusHistory {

    @Id
    @Column(nullable = false, updatable = false)
    @GeneratedValue
    @UuidGenerator
    private UUID id;

    @Column
    private UUID loadId;

    @Column
    private String oldStatus;

    @Column(nullable = false)
    private String newStatus;

    @Column
    private String changeReason;

    @Column(columnDefinition = "text")
    private String notes;

    @Column
    private OffsetDateTime createdAt;

}
