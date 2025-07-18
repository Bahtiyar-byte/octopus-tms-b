# Core UI Components

This directory contains the shared UI components that provide consistent design and functionality across the Octopus TMS application.

## Components

### Button

A versatile button component with multiple variants and states.

```tsx
import { Button } from '@/components/ui';

// Primary button
<Button variant="primary" onClick={handleClick}>
  Save Changes
</Button>

// Secondary button with icon
<Button variant="secondary" icon={<PlusIcon />}>
  Add New
</Button>

// Loading state
<Button variant="primary" loading>
  Processing...
</Button>

// Danger button
<Button variant="danger" onClick={handleDelete}>
  Delete
</Button>

// Full width button
<Button variant="primary" fullWidth>
  Submit
</Button>

// Different sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost'
- `size`: 'sm' | 'md' | 'lg'
- `loading`: boolean
- `icon`: React.ReactNode
- `iconPosition`: 'left' | 'right'
- `fullWidth`: boolean
- All standard button HTML attributes

### FormField

A form field component that combines label, input, and error message.

```tsx
import { FormField } from '@/components/ui';
import { useState } from 'react';

function MyForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  return (
    <FormField
      label="Email Address"
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      error={error}
      helperText="We'll never share your email"
      required
    />
  );
}

// With custom styling
<FormField
  label="Load Number"
  placeholder="Enter load number"
  inputClassName="font-mono"
  containerClassName="mb-6"
/>
```

**Props:**
- `label`: string
- `error`: string
- `helperText`: string
- `required`: boolean
- `containerClassName`: string
- `labelClassName`: string
- `inputClassName`: string
- `errorClassName`: string
- `helperClassName`: string
- All standard input HTML attributes

### Modal

A flexible modal dialog component with accessibility features.

```tsx
import { Modal, Button } from '@/components/ui';
import { useState } from 'react';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Confirm Action"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleConfirm}>
              Confirm
            </Button>
          </>
        }
      >
        <p>Are you sure you want to proceed with this action?</p>
      </Modal>
    </>
  );
}

// Large modal without footer
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="Load Details"
  size="lg"
>
  <LoadDetailsContent />
</Modal>

// Modal without overlay click to close
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  closeOnOverlayClick={false}
  closeOnEscape={false}
>
  <ImportantForm />
</Modal>
```

**Props:**
- `isOpen`: boolean
- `onClose`: () => void
- `title`: string
- `footer`: React.ReactNode
- `size`: 'sm' | 'md' | 'lg' | 'xl'
- `closeOnOverlayClick`: boolean (default: true)
- `closeOnEscape`: boolean (default: true)
- `showCloseButton`: boolean (default: true)
- `className`: string
- `contentClassName`: string

### Spinner / Loader

A loading indicator component with different sizes and colors.

```tsx
import { Spinner, Loader } from '@/components/ui';

// Default spinner
<Spinner />

// Different sizes
<Spinner size="sm" />
<Spinner size="md" />
<Spinner size="lg" />
<Spinner size="xl" />

// Different colors
<Spinner color="primary" />
<Spinner color="secondary" />
<Spinner color="white" />
<Spinner color="gray" />

// With custom label for screen readers
<Spinner label="Loading shipment data..." />

// Inline with text
<div className="flex items-center gap-2">
  <Spinner size="sm" />
  <span>Loading...</span>
</div>

// Centered in container
<div className="flex justify-center items-center h-64">
  <Spinner size="lg" />
</div>
```

**Props:**
- `size`: 'sm' | 'md' | 'lg' | 'xl'
- `color`: 'primary' | 'secondary' | 'white' | 'gray'
- `className`: string
- `label`: string (for accessibility)

## Usage Guidelines

### Accessibility
- All components follow WCAG 2.1 AA standards
- Proper ARIA labels and roles are included
- Keyboard navigation is supported
- Focus management is handled in Modal component

### Styling
- Components use Tailwind CSS classes
- Support `className` prop for custom styling
- Designed to work with the existing Octopus TMS design system

### TypeScript
- All components are fully typed
- Export interfaces for all props
- Use with strict TypeScript settings

## Examples in Context

### Creating a New Load Form
```tsx
import { Button, FormField, Modal } from '@/components/ui';

function NewLoadModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    rate: ''
  });
  const [errors, setErrors] = useState({});

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Load"
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Create Load
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <FormField
          label="Origin"
          value={formData.origin}
          onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
          error={errors.origin}
          required
        />
        <FormField
          label="Destination"
          value={formData.destination}
          onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
          error={errors.destination}
          required
        />
        <FormField
          label="Rate"
          type="number"
          value={formData.rate}
          onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
          error={errors.rate}
          helperText="Enter rate in USD"
          required
        />
      </div>
    </Modal>
  );
}
```

### Loading State Pattern
```tsx
import { Button, Spinner } from '@/components/ui';

function LoadList() {
  const [isLoading, setIsLoading] = useState(true);
  const [loads, setLoads] = useState([]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner size="lg" label="Loading loads..." />
      </div>
    );
  }

  return (
    <div>
      {/* Load list content */}
    </div>
  );
}
```