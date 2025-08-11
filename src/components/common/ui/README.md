# Reusable UI Components

This directory contains reusable UI components built with Tailwind CSS that maintain consistent styling and behavior across the application.

## Components

### FormInput
A reusable input component with label, error handling, and loading states.

**Props:**
- `label: string` - The label text for the input
- `error?: string` - Error message to display below the input
- `isLoading?: boolean` - Whether the input is in loading state
- `id: string` - HTML id for the input element
- `className?: string` - Additional CSS classes
- `...inputProps` - All standard HTML input attributes

**Usage:**
```tsx
<FormInput
  id="email"
  name="email"
  type="email"
  label="Email Address"
  value={email}
  onChange={handleChange}
  placeholder="Enter your email"
  error={errors.email}
  isLoading={isSubmitting}
/>
```

### FormButton
A reusable button component with loading states and variants.

**Props:**
- `isLoading?: boolean` - Whether the button is in loading state
- `loadingText?: string` - Text to display during loading (default: "Loading...")
- `variant?: 'primary' | 'secondary'` - Button style variant (default: 'primary')
- `className?: string` - Additional CSS classes
- `...buttonProps` - All standard HTML button attributes

**Usage:**
```tsx
<FormButton
  type="submit"
  isLoading={isSubmitting}
  loadingText="Signing in..."
  variant="primary"
>
  Sign In
</FormButton>
```

### ErrorMessage
A reusable component for displaying error messages.

**Props:**
- `message?: string` - The error message to display
- `className?: string` - Additional CSS classes
- `centered?: boolean` - Whether to center the text (default: false)

**Usage:**
```tsx
<ErrorMessage 
  message={error} 
  centered 
  className="mb-4" 
/>
```

## Design System

### Colors
- **Primary**: Black (`bg-black`) with gray hover (`hover:bg-gray-800`)
- **Secondary**: Light gray (`bg-gray-100`) with darker hover (`hover:bg-gray-200`)
- **Error**: Red variants (`text-red-600`, `bg-red-50`, `border-red-300`)
- **Text**: Gray variants (`text-gray-700`, `text-gray-900`)

### Spacing
- **Form spacing**: `space-y-6` for form elements
- **Input height**: `h-12` for consistent input sizing
- **Padding**: `px-4 py-3` for input internal spacing

### Typography
- **Labels**: `text-sm font-medium text-gray-700`
- **Error text**: `text-xs text-red-600`
- **Button text**: `text-sm font-medium`

## Best Practices

1. **Consistency**: Always use these components instead of creating one-off styled elements
2. **Accessibility**: All components include proper ARIA attributes and semantic HTML
3. **Responsiveness**: Components are built mobile-first with responsive utilities
4. **Customization**: Use the `className` prop to extend styling when needed
5. **Performance**: Components use string concatenation instead of complex class merging utilities for better performance

## Examples

### Login Form
```tsx
<form className="space-y-6" onSubmit={handleSubmit}>
  <ErrorMessage message={generalError} centered />
  
  <FormInput
    id="email"
    type="email"
    label="Email"
    value={email}
    onChange={handleEmailChange}
    error={emailError}
    isLoading={isSubmitting}
  />
  
  <FormInput
    id="password"
    type="password"
    label="Password"
    value={password}
    onChange={handlePasswordChange}
    error={passwordError}
    isLoading={isSubmitting}
  />
  
  <FormButton
    type="submit"
    isLoading={isSubmitting}
    loadingText="Signing in..."
  >
    Sign In
  </FormButton>
</form>
```

### Contact Form
```tsx
<form className="space-y-4">
  <FormInput
    id="name"
    label="Name"
    value={name}
    onChange={handleNameChange}
    error={nameError}
  />
  
  <FormInput
    id="message"
    label="Message"
    value={message}
    onChange={handleMessageChange}
    error={messageError}
  />
  
  <FormButton variant="secondary">
    Send Message
  </FormButton>
</form>
```