create table if not exists public.flyway_schema_history
(
    installed_rank integer                 not null
        constraint flyway_schema_history_pk
            primary key,
    version        varchar(50),
    description    varchar(200)            not null,
    type           varchar(20)             not null,
    script         varchar(1000)           not null,
    checksum       integer,
    installed_by   varchar(100)            not null,
    installed_on   timestamp default now() not null,
    execution_time integer                 not null,
    success        boolean                 not null
);

alter table public.flyway_schema_history
    owner to haydarovbahtiyar;

create index flyway_schema_history_s_idx
    on public.flyway_schema_history (success);

create table if not exists public.companies
(
    id            uuid         not null
        primary key,
    name          varchar(255) not null,
    type          varchar(100) not null,
    mc_number     varchar(50),
    dot_number    varchar(50),
    ein           varchar(50),
    address_line1 varchar(255),
    address_line2 varchar(255),
    city          varchar(100),
    state         varchar(50),
    zip_code      varchar(20),
    country       varchar(50),
    phone         varchar(50),
    email         varchar(255),
    website       varchar(255),
    logo_url      varchar(500),
    status        varchar(50),
    credit_limit  numeric(10, 2),
    credit_used   numeric(10, 2),
    payment_terms integer,
    created_at    timestamp,
    updated_at    timestamp
);

alter table public.companies
    owner to haydarovbahtiyar;

create table if not exists public.users
(
    id                    uuid         not null
        primary key,
    username              varchar(100) not null,
    email                 varchar(255) not null,
    password_hash         varchar(255) not null,
    first_name            varchar(100),
    last_name             varchar(100),
    phone                 varchar(50),
    role                  varchar(100) not null,
    department            varchar(100),
    avatar_url            varchar(500),
    status                varchar(50),
    last_login            timestamp,
    failed_login_attempts integer,
    locked_until          timestamp,
    reset_token           varchar(255),
    reset_token_starts    timestamp,
    created_at            timestamp,
    updated_at            timestamp,
    company_id            uuid
        constraint fk_users_company_id
            references public.companies,
    company_type          varchar(25)
);

alter table public.users
    owner to haydarovbahtiyar;

create table if not exists public.user_preferences
(
    id                  uuid not null
        primary key,
    theme               varchar(50),
    timezone            varchar(100),
    notifications_email boolean,
    notifications_sms   boolean,
    notifications_push  boolean,
    language            varchar(10),
    dashboard_layout    text,
    created_at          timestamp,
    updated_at          timestamp,
    user_id             uuid
        constraint unique_user_preferences_user_id
            unique
        constraint fk_user_preferences_user_id
            references public.users
);

alter table public.user_preferences
    owner to haydarovbahtiyar;

create table if not exists public.audit_logs
(
    id          uuid         not null
        primary key,
    user_id     uuid,
    company_id  uuid,
    action      varchar(100) not null,
    entity_type varchar(100),
    entity_id   uuid,
    old_values  text,
    new_values  text,
    ip_address  varchar(255),
    user_agent  text,
    created_at  timestamp
);

alter table public.audit_logs
    owner to haydarovbahtiyar;

create table if not exists public.workflows
(
    id            uuid         not null
        primary key,
    company_id    uuid,
    name          varchar(255) not null,
    description   text,
    module_type   varchar(50)  not null,
    status        varchar(50),
    version       integer,
    workflow_data text         not null,
    created_by    uuid,
    created_at    timestamp,
    updated_at    timestamp
);

alter table public.workflows
    owner to haydarovbahtiyar;

create table if not exists public.workflow_executions
(
    id                uuid not null
        primary key,
    workflow_id       uuid,
    trigger_type      varchar(100),
    trigger_entity_id uuid,
    status            varchar(50),
    started_at        timestamp,
    completed_at      timestamp,
    error_message     text,
    execution_data    text
);

alter table public.workflow_executions
    owner to haydarovbahtiyar;

create table if not exists public.workflow_logs
(
    id           uuid not null
        primary key,
    execution_id uuid,
    node_id      varchar(100),
    node_type    varchar(50),
    status       varchar(50),
    message      text,
    data         text,
    created_at   timestamp
);

alter table public.workflow_logs
    owner to haydarovbahtiyar;

create table if not exists public.notifications
(
    id         uuid        not null
        primary key,
    type       varchar(50) not null,
    title      varchar(255),
    message    text,
    data       text,
    read       boolean,
    read_at    timestamp,
    created_at timestamp,
    user_id    uuid        not null
        constraint fk_notifications_user_id
            references public.users
);

alter table public.notifications
    owner to haydarovbahtiyar;

create table if not exists public.ai_provider_configs
(
    id                  bigint      not null
        primary key,
    user_id             uuid        not null,
    provider            varchar(50) not null,
    api_key             text,
    oauth_token         text,
    oauth_refresh_token text,
    is_active           boolean,
    connection_status   varchar(20),
    last_tested         timestamp,
    created_at          timestamp   not null,
    updated_at          timestamp   not null,
    additional_settings varchar
);

alter table public.ai_provider_configs
    owner to haydarovbahtiyar;

create table if not exists public.loads
(
    id                   uuid         not null
        primary key,
    load_number          varchar(50)  not null,
    broker_id            uuid,
    shipper_id           uuid,
    carrier_id           uuid,
    status               varchar(100) not null,
    origin_address       varchar(500),
    origin_city          varchar(100),
    origin_state         varchar(50),
    origin_zip           varchar(20),
    origin_lat           numeric(10, 6),
    origin_lng           numeric(10, 6),
    destination_address  varchar(500),
    destination_city     varchar(100),
    destination_state    varchar(50),
    destination_zip      varchar(20),
    destination_lat      numeric(10, 6),
    destination_lng      numeric(10, 6),
    distance             integer,
    commodity            varchar(255),
    weight               integer,
    equipment_type       varchar(100),
    routing_type         varchar(100),
    rate                 numeric(10, 2),
    carrier_rate         numeric(10, 2),
    pickup_date          date,
    pickup_time_start    time,
    pickup_time_end      time,
    delivery_date        date,
    delivery_time_start  time,
    delivery_time_end    time,
    notes                text,
    special_instructions text,
    reference_number     varchar(100),
    posted_to_loadboards boolean,
    created_by           uuid,
    assigned_dispatcher  uuid,
    assigned_driver_id   uuid,
    created_at           timestamp,
    updated_at           timestamp
);

alter table public.loads
    owner to haydarovbahtiyar;

create table if not exists public.load_stops
(
    id                   uuid         not null
        primary key,
    stop_number          integer      not null,
    stop_type            varchar(100) not null,
    company_id           uuid,
    warehouse_id         uuid,
    location_name        varchar(255),
    address_line1        varchar(255),
    address_line2        varchar(255),
    city                 varchar(100),
    state                varchar(50),
    zip_code             varchar(20),
    country              varchar(50),
    latitude             numeric(10, 6),
    longitude            numeric(10, 6),
    contact_name         varchar(255),
    contact_phone        varchar(50),
    contact_email        varchar(255),
    scheduled_date       date,
    scheduled_time_start time,
    scheduled_time_end   time,
    actual_arrival       timestamp,
    actual_departure     timestamp,
    notes                text,
    special_instructions text,
    created_at           timestamp,
    updated_at           timestamp,
    load_id              uuid         not null
        constraint fk_load_stops_load_id
            references public.loads
);

alter table public.load_stops
    owner to haydarovbahtiyar;

create table if not exists public.load_cargoes
(
    id                     uuid           not null
        primary key,
    commodity              varchar(255)   not null,
    commodity_code         varchar(50),
    weight                 numeric(10, 2) not null,
    weight_unit            varchar(10),
    pieces                 integer,
    pallet_count           integer,
    dimensions             text,
    hazmat                 boolean,
    hazmat_class           varchar(50),
    un_number              varchar(10),
    temperature_controlled boolean,
    temperature_min        numeric(5, 2),
    temperature_max        numeric(5, 2),
    temperature_unit       varchar(10),
    cargo_value            numeric(12, 2),
    po_number              varchar(100),
    seal_number            varchar(50),
    cargo_status           varchar(50),
    reference_number       varchar(100),
    created_at             timestamp,
    updated_at             timestamp,
    load_id                uuid           not null
        constraint fk_load_cargoes_load_id
            references public.loads,
    pickup_stop_id         uuid
        constraint fk_load_cargoes_pickup_stop_id
            references public.load_stops,
    delivery_stop_id       uuid
        constraint fk_load_cargoes_delivery_stop_id
            references public.load_stops
);

alter table public.load_cargoes
    owner to haydarovbahtiyar;

create table if not exists public.load_status_histories
(
    id            uuid         not null
        primary key,
    load_id       uuid,
    old_status    varchar(255),
    new_status    varchar(255) not null,
    change_reason varchar(255),
    notes         text,
    created_at    timestamp
);

alter table public.load_status_histories
    owner to haydarovbahtiyar;

create table if not exists public.load_trackings
(
    id            uuid not null
        primary key,
    driver_id     uuid,
    latitude      numeric(10, 6),
    longitude     numeric(10, 6),
    location_name varchar(255),
    speed         integer,
    heading       integer,
    odometer      integer,
    engine_hours  integer,
    fuel_level    integer,
    temperature   numeric(5, 2),
    status        varchar(50),
    event_type    varchar(100),
    notes         text,
    created_at    timestamp,
    load_id       uuid not null
        constraint fk_load_trackings_load_id
            references public.loads
);

alter table public.load_trackings
    owner to haydarovbahtiyar;

create table if not exists public.load_documents
(
    id            uuid         not null
        primary key,
    stop_id       uuid,
    load_cargo_id uuid,
    document_type varchar(100) not null,
    file_name     varchar(255) not null,
    file_path     varchar(500) not null,
    file_size     integer,
    mime_type     varchar(100),
    uploaded_by   uuid,
    uploaded_at   timestamp,
    load_id       uuid         not null
        constraint fk_load_documents_load_id
            references public.loads
);

alter table public.load_documents
    owner to haydarovbahtiyar;

create table if not exists public.load_offers
(
    id             uuid not null
        primary key,
    carrier_id     uuid,
    offered_rate   numeric(10, 2),
    status         varchar(50),
    valid_until    timestamp,
    equipment_type varchar(100),
    driver_id      uuid,
    notes          text,
    created_by     uuid,
    created_at     timestamp,
    updated_at     timestamp,
    load_id        uuid not null
        constraint fk_load_offers_load_id
            references public.loads
);

alter table public.load_offers
    owner to haydarovbahtiyar;

create table if not exists public.load_status_events
(
    id              uuid         not null
        primary key,
    event_type      varchar(100) not null,
    event_timestamp timestamp    not null,
    old_value       varchar(255),
    new_value       varchar(255),
    stop_id         uuid,
    latitude        numeric(10, 6),
    longitude       numeric(10, 6),
    notes           text,
    metadata        text,
    created_by      uuid,
    load_id         uuid         not null
        constraint fk_load_status_events_load_id
            references public.loads
);

alter table public.load_status_events
    owner to haydarovbahtiyar;

create table if not exists public.load_assignments
(
    id                     uuid        not null
        primary key,
    load_id                uuid        not null,
    assignment_type        varchar(50) not null,
    assigned_to_id         uuid,
    assigned_to_company_id uuid,
    assigned_at            timestamp   not null,
    unassigned_at          timestamp,
    assignment_reason      varchar(255),
    unassignment_reason    varchar(255),
    notes                  text,
    assigned_by            uuid,
    unassigned_by          uuid
);

alter table public.load_assignments
    owner to haydarovbahtiyar;

create table if not exists public.warehouses
(
    id              uuid         not null
        primary key,
    company_id      uuid,
    name            varchar(255) not null,
    code            varchar(50),
    address         varchar(500),
    city            varchar(100),
    state           varchar(50),
    zip             varchar(20),
    latitude        numeric(10, 6),
    longitude       numeric(10, 6),
    manager_id      uuid,
    phone           varchar(50),
    email           varchar(255),
    operating_hours text,
    capacity_sqft   integer,
    dock_doors      integer,
    status          varchar(50),
    created_at      timestamp,
    updated_at      timestamp
);

alter table public.warehouses
    owner to haydarovbahtiyar;

create table if not exists public.inventory_items
(
    id                     uuid         not null
        primary key,
    company_id             uuid,
    sku                    varchar(100) not null,
    name                   varchar(255) not null,
    description            text,
    category               varchar(100),
    unit_of_measure        varchar(50),
    weight                 numeric(10, 2),
    length                 numeric(10, 2),
    width                  numeric(10, 2),
    height                 numeric(10, 2),
    reorder_point          integer,
    reorder_quantity       integer,
    hazmat                 boolean,
    temperature_controlled boolean,
    fragile                boolean,
    status                 varchar(50),
    created_at             timestamp,
    updated_at             timestamp
);

alter table public.inventory_items
    owner to haydarovbahtiyar;

create table if not exists public.drivers
(
    id                      uuid not null
        primary key,
    company_id              uuid,
    user_id                 uuid,
    driver_code             varchar(50),
    cdl_number              varchar(50),
    cdl_state               varchar(50),
    cdl_expiration          date,
    medical_cert_expiration date,
    hazmat_endorsed         boolean,
    tanker_endorsed         boolean,
    doubles_endorsed        boolean,
    assigned_truck          varchar(50),
    home_terminal           varchar(100),
    status                  varchar(50),
    hire_date               date,
    termination_date        date,
    emergency_contact_name  varchar(255),
    emergency_contact_phone varchar(50),
    created_at              timestamp,
    updated_at              timestamp
);

alter table public.drivers
    owner to haydarovbahtiyar;

create table if not exists public.driver_performances
(
    id                 uuid not null
        primary key,
    period_start       date not null,
    period_end         date not null,
    miles_driven       integer,
    loads_completed    integer,
    on_time_percentage numeric(5, 2),
    safety_score       numeric(5, 2),
    fuel_efficiency    numeric(5, 2),
    customer_rating    numeric(3, 2),
    violations         integer,
    accidents          integer,
    created_at         timestamp,
    driver_id          uuid
        constraint fk_driver_performances_driver_id
            references public.drivers
);

alter table public.driver_performances
    owner to haydarovbahtiyar;

create table if not exists public.equipments
(
    id                   uuid         not null
        primary key,
    carrier_id           uuid         not null,
    equipment_number     varchar(50)  not null,
    equipment_type       varchar(100) not null,
    year                 integer,
    make                 varchar(100),
    model                varchar(100),
    vin                  varchar(50),
    license_plate        varchar(50),
    license_state        varchar(2),
    color                varchar(50),
    status               varchar(50),
    current_location     varchar(255),
    current_driver_id    uuid,
    last_inspection_date date,
    next_inspection_due  date,
    registration_expiry  date,
    insurance_expiry     date,
    eld_provider         varchar(100),
    eld_id               varchar(100),
    notes                text,
    created_at           timestamp,
    updated_at           timestamp
);

alter table public.equipments
    owner to haydarovbahtiyar;

create table if not exists public.invoices
(
    id                uuid           not null
        primary key,
    invoice_number    varchar(50)    not null,
    load_id           uuid,
    company_id        uuid,
    invoice_type      varchar(50)    not null,
    status            varchar(100),
    amount            numeric(10, 2) not null,
    tax_amount        numeric(10, 2),
    total_amount      numeric(10, 2) not null,
    due_date          date,
    paid_date         date,
    payment_method    varchar(50),
    payment_reference varchar(100),
    notes             text,
    created_by        uuid,
    created_at        timestamp,
    updated_at        timestamp
);

alter table public.invoices
    owner to haydarovbahtiyar;

create table if not exists public.payments
(
    id                  uuid           not null
        primary key,
    company_id          uuid           not null,
    payment_number      varchar(50),
    amount              numeric(10, 2) not null,
    payment_method      varchar(100),
    payment_date        date,
    reference_number    varchar(100),
    status              varchar(50),
    processor           varchar(50),
    processor_reference varchar(100),
    notes               text,
    created_by          uuid,
    created_at          timestamp,
    updated_at          timestamp,
    invoice_id          uuid
        constraint fk_payments_invoice_id
            references public.invoices
);

alter table public.payments
    owner to haydarovbahtiyar;

create table if not exists public.invoice_line_items
(
    id          uuid not null
        primary key,
    description varchar(500),
    quantity    numeric(10, 2),
    unit_price  numeric(10, 2),
    amount      numeric(10, 2),
    tax_rate    numeric(5, 2),
    tax_amount  numeric(10, 2),
    created_at  timestamp,
    invoice_id  uuid not null
        constraint fk_invoice_line_items_invoice_id
            references public.invoices
);

alter table public.invoice_line_items
    owner to haydarovbahtiyar;

create table if not exists public.accessorial_charges
(
    id          uuid           not null
        primary key,
    charge_type varchar(100)   not null,
    description text,
    quantity    numeric(10, 2),
    rate        numeric(10, 2) not null,
    amount      numeric(10, 2) not null,
    billable_to varchar(50)    not null,
    status      varchar(50),
    approved_at timestamp,
    receipt_url varchar(500),
    notes       text,
    created_at  timestamp
);

alter table public.accessorial_charges
    owner to haydarovbahtiyar;

create table if not exists public.rate_agreements
(
    id                     uuid        not null
        primary key,
    agreement_number       varchar(50) not null,
    lane_origin_city       varchar(100),
    lane_origin_state      varchar(50),
    lane_origin_zip        varchar(20),
    lane_destination_city  varchar(100),
    lane_destination_state varchar(50),
    lane_destination_zip   varchar(20),
    equipment_type         varchar(100),
    base_rate              numeric(10, 2),
    rate_per_mile          numeric(5, 2),
    fuel_surcharge_percent numeric(5, 2),
    min_rate               numeric(10, 2),
    accessorial_rates      text,
    valid_from             date        not null,
    valid_until            date        not null,
    auto_renew             boolean,
    status                 varchar(50),
    notes                  text,
    created_at             timestamp,
    updated_at             timestamp
);

alter table public.rate_agreements
    owner to haydarovbahtiyar;

create table if not exists public.inventory_levels
(
    id                 uuid    not null
        primary key,
    quantity           integer not null,
    available_quantity integer not null,
    reserved_quantity  integer not null,
    location_zone      varchar(50),
    location_aisle     varchar(50),
    location_rack      varchar(50),
    location_bin       varchar(50),
    last_count_date    date,
    created_at         timestamp,
    updated_at         timestamp,
    item_id            uuid
        constraint fk_inventory_levels_item_id
            references public.inventory_items,
    warehouse_id       uuid    not null
        constraint fk_inventory_levels_warehouse_id
            references public.warehouses
);

alter table public.inventory_levels
    owner to haydarovbahtiyar;

create table if not exists public.inventory_movements
(
    id                uuid        not null
        primary key,
    item_id           uuid,
    movement_type     varchar(50) not null,
    quantity          integer     not null,
    from_location     varchar(255),
    to_location       varchar(255),
    reference_type    varchar(50),
    reference_id      uuid,
    notes             text,
    created_by        uuid,
    created_at        timestamp,
    inventory_item_id uuid        not null
        constraint fk_inventory_movements_inventory_item_id
            references public.inventory_items,
    warehouse_id      uuid        not null
        constraint fk_inventory_movements_warehouse_id
            references public.warehouses
);

alter table public.inventory_movements
    owner to haydarovbahtiyar;

create table if not exists public.shipment_readinesses
(
    id                   uuid not null
        primary key,
    warehouse_id         uuid,
    order_number         varchar(100),
    customer_id          uuid,
    status               varchar(50),
    priority             varchar(50),
    required_date        date,
    special_instructions text,
    total_items          integer,
    picked_items         integer,
    packed_items         integer,
    created_by           uuid,
    created_at           timestamp,
    updated_at           timestamp
);

alter table public.shipment_readinesses
    owner to haydarovbahtiyar;

create table if not exists public.contracts
(
    id                     uuid not null,
    broker_id              uuid,
    carrier_id             uuid,
    contract_number        varchar(50),
    status                 varchar(50),
    effective_date         date,
    expiration_date        date,
    auto_renew             boolean,
    terms                  text,
    rate_schedule          text,
    insurance_requirements text,
    signed_date            date,
    signed_by              varchar(255),
    file_path              varchar(500),
    created_by             uuid,
    created_at             timestamp,
    updated_at             timestamp
);

alter table public.contracts
    owner to haydarovbahtiyar;

