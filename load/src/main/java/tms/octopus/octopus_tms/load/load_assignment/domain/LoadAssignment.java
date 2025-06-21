package tms.octopus.octopus_tms.load.load_assignment.domain;

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
@Table(name = "LoadAssignments")
@Getter
@Setter
public class LoadAssignment {

    @Id
    @Column(nullable = false, updatable = false)
    @GeneratedValue
    @UuidGenerator
    private UUID id;

    @Column(nullable = false)
    private UUID loadId;

    @Column(nullable = false, length = 50)
    private String assignmentType;

    @Column
    private UUID assignedToId;

    @Column
    private UUID assignedToCompanyId;

    @Column(nullable = false)
    private OffsetDateTime assignedAt;

    @Column
    private OffsetDateTime unassignedAt;

    @Column
    private String assignmentReason;

    @Column
    private String unassignmentReason;

    @Column(columnDefinition = "text")
    private String notes;

    @Column
    private UUID assignedBy;

    @Column
    private UUID unassignedBy;

}
