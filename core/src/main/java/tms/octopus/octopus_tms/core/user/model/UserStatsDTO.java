package tms.octopus.octopus_tms.core.user.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserStatsDTO {
    
    private Integer actionsToday = 0;
    private Integer loadsDispatched = 0;
    private Integer tasksCompleted = 0;
    private Integer performanceScore = 0;
    
    // For dispatchers/supervisors
    private Integer activeDriversToday = 0;
    private Integer totalDriversManaged = 0;
    
    // For customer service
    private Integer totalCustomersServed = 0;
    private String avgResponseTime = "0 min";
    
    // For brokers
    private Integer dealsClosedThisMonth = 0;
    private Double revenueGenerated = 0.0;
    
    // For shippers
    private Integer shipmentsThisMonth = 0;
    private Integer warehouseCapacityUsed = 0;
}