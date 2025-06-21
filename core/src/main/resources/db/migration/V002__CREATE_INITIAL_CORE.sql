CREATE TABLE companies (
    id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    mc_number VARCHAR(50),
    dot_number VARCHAR(50),
    ein VARCHAR(50),
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(50),
    zip_code VARCHAR(20),
    country VARCHAR(50),
    phone VARCHAR(50),
    email VARCHAR(255),
    website VARCHAR(255),
    logo_url VARCHAR(500),
    status VARCHAR(50),
    credit_limit numeric(10, 2),
    credit_used numeric(10, 2),
    payment_terms INTEGER,
    created_at TIMESTAMP WITHOUT TIME ZONE,
    updated_at TIMESTAMP WITHOUT TIME ZONE,
    CONSTRAINT companies_pkey PRIMARY KEY (id)
);

CREATE TABLE users (
    id UUID NOT NULL,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(50),
    role VARCHAR(100) NOT NULL,
    department VARCHAR(100),
    avatar_url VARCHAR(500),
    status VARCHAR(50),
    last_login TIMESTAMP WITHOUT TIME ZONE,
    failed_login_attempts INTEGER,
    locked_until TIMESTAMP WITHOUT TIME ZONE,
    reset_token VARCHAR(255),
    reset_token_starts TIMESTAMP WITHOUT TIME ZONE,
    created_at TIMESTAMP WITHOUT TIME ZONE,
    updated_at TIMESTAMP WITHOUT TIME ZONE,
    company_id UUID,
    CONSTRAINT users_pkey PRIMARY KEY (id)
);

CREATE TABLE user_preferences (
    id UUID NOT NULL,
    theme VARCHAR(50),
    timezone VARCHAR(100),
    notifications_email BOOLEAN,
    notifications_sms BOOLEAN,
    notifications_push BOOLEAN,
    language VARCHAR(10),
    dashboard_layout TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE,
    updated_at TIMESTAMP WITHOUT TIME ZONE,
    user_id UUID,
    CONSTRAINT user_preferences_pkey PRIMARY KEY (id)
);

CREATE TABLE audit_logs (
    id UUID NOT NULL,
    user_id UUID,
    company_id UUID,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100),
    entity_id UUID,
    old_values TEXT,
    new_values TEXT,
    ip_address VARCHAR(255),
    user_agent TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE,
    CONSTRAINT audit_logs_pkey PRIMARY KEY (id)
);

CREATE TABLE workflows (
    id UUID NOT NULL,
    company_id UUID,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    module_type VARCHAR(50) NOT NULL,
    status VARCHAR(50),
    version INTEGER,
    workflow_data TEXT NOT NULL,
    created_by UUID,
    created_at TIMESTAMP WITHOUT TIME ZONE,
    updated_at TIMESTAMP WITHOUT TIME ZONE,
    CONSTRAINT workflows_pkey PRIMARY KEY (id)
);

CREATE TABLE workflow_executions (
    id UUID NOT NULL,
    workflow_id UUID,
    trigger_type VARCHAR(100),
    trigger_entity_id UUID,
    status VARCHAR(50),
    started_at TIMESTAMP WITHOUT TIME ZONE,
    completed_at TIMESTAMP WITHOUT TIME ZONE,
    error_message TEXT,
    execution_data TEXT,
    CONSTRAINT workflow_executions_pkey PRIMARY KEY (id)
);

CREATE TABLE workflow_logs (
    id UUID NOT NULL,
    execution_id UUID,
    node_id VARCHAR(100),
    node_type VARCHAR(50),
    status VARCHAR(50),
    message TEXT,
    data TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE,
    CONSTRAINT workflow_logs_pkey PRIMARY KEY (id)
);

CREATE TABLE notifications (
    id UUID NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255),
    message TEXT,
    data TEXT,
    read BOOLEAN,
    read_at TIMESTAMP WITHOUT TIME ZONE,
    created_at TIMESTAMP WITHOUT TIME ZONE,
    user_id UUID NOT NULL,
    CONSTRAINT notifications_pkey PRIMARY KEY (id)
);

CREATE TABLE ai_provider_configs (
    id BIGINT NOT NULL,
    user_id UUID NOT NULL,
    provider VARCHAR(50) NOT NULL,
    api_key TEXT,
    oauth_token TEXT,
    oauth_refresh_token TEXT,
    is_active BOOLEAN,
    connection_status VARCHAR(20),
    last_tested TIMESTAMP WITHOUT TIME ZONE,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    CONSTRAINT ai_provider_configs_pkey PRIMARY KEY (id)
);

ALTER TABLE users ADD CONSTRAINT fk_users_company_id FOREIGN KEY (company_id) REFERENCES companies (id) ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE user_preferences ADD CONSTRAINT fk_user_preferences_user_id FOREIGN KEY (user_id) REFERENCES users (id) ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE user_preferences ADD CONSTRAINT unique_user_preferences_user_id UNIQUE (user_id);

ALTER TABLE notifications ADD CONSTRAINT fk_notifications_user_id FOREIGN KEY (user_id) REFERENCES users (id) ON UPDATE NO ACTION ON DELETE NO ACTION;
