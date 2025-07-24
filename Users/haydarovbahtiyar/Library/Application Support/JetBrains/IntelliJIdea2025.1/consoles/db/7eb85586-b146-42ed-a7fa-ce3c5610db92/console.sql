INSERT INTO invoices (
      id, invoice_number, load_id, company_id, invoice_type, status,
      amount, tax_amount, total_amount, due_date, paid_date,
      payment_method, payment_reference, notes, created_by, created_at, updated_at
    )
    VALUES (
      'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, -- Generate a real UUID with gen_random_uuid() in real scenarios
      'INV-0001', '00000000-0000-0000-0000-000000000001'::uuid, '00000000-0000-0000-0000-000000000001'::uuid,
      'STANDARD', 'PENDING', 100.00, 10.00, 110.00,
      '2025-07-31', NULL, 'CREDIT_CARD', NULL, NULL,
      'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, NOW(), NOW()
    );
