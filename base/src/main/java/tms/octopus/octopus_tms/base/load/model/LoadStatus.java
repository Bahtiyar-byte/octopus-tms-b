package tms.octopus.octopus_tms.base.load.model;


public enum LoadStatus {

    DRAFT,
    PENDING_BROKER_ACCEPTANCE,
    ACTIVE,
    ASSIGNED,
    DISPATCHED,
    IN_TRANSIT,
    DELIVERED,
    INVOICED,
    PAID,
    CANCELLED,
    NEW,
    New,
    Posted,

    // Additional statuses from frontend
    AWAITING_DOCS,
    POD_RECEIVED,
    CLOSED,
    CARRIER_ASSIGNED,
    EN_ROUTE,

    // Mixed-case versions to match frontend exactly
    Awaiting_Docs,
    POD_Received,
    Closed,
    Carrier_Assigned,
    En_Route,
    Assigned,
    InTransit,
    Delivered,
    Invoiced,
    Paid,
    Cancelled


}
