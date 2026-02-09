import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@/test/test-utils'
import { userEvent } from '@testing-library/user-event'
import { UserForm } from './UserForm'
import { toast } from 'sonner'

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
  },
}))

describe('UserForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders name input field', () => {
      render(<UserForm />)

      const nameInput = screen.getByLabelText(/name/i)
      expect(nameInput).toBeInTheDocument()
      expect(nameInput).toHaveAttribute('placeholder', 'John Doe')
    })

    it('renders email input field', () => {
      render(<UserForm />)

      const emailInput = screen.getByLabelText(/email/i)
      expect(emailInput).toBeInTheDocument()
      expect(emailInput).toHaveAttribute('type', 'email')
      expect(emailInput).toHaveAttribute('placeholder', 'john@example.com')
    })

    it('renders submit button', () => {
      render(<UserForm />)

      const submitButton = screen.getByRole('button', { name: /submit/i })
      expect(submitButton).toBeInTheDocument()
      expect(submitButton).not.toBeDisabled()
    })

    it('renders labels for inputs', () => {
      render(<UserForm />)

      expect(screen.getByText('Name')).toBeInTheDocument()
      expect(screen.getByText('Email')).toBeInTheDocument()
    })
  })

  describe('Validation - Name Field', () => {
    it('shows error when name is too short', async () => {
      const user = userEvent.setup()
      render(<UserForm />)

      const nameInput = screen.getByLabelText(/name/i)
      await user.type(nameInput, 'A')

      await waitFor(() => {
        expect(
          screen.getByText(/name must be at least 2 characters/i)
        ).toBeInTheDocument()
      })
    })

    it('clears error when name becomes valid', async () => {
      const user = userEvent.setup()
      render(<UserForm />)

      const nameInput = screen.getByLabelText(/name/i)

      await user.type(nameInput, 'A')

      await waitFor(() => {
        expect(
          screen.getByText(/name must be at least 2 characters/i)
        ).toBeInTheDocument()
      })

      await user.type(nameInput, 'nna')

      await waitFor(() => {
        expect(
          screen.queryByText(/name must be at least 2 characters/i)
        ).not.toBeInTheDocument()
      })
    })

    it('does not show error when name is valid from start', async () => {
      const user = userEvent.setup()
      render(<UserForm />)

      const nameInput = screen.getByLabelText(/name/i)
      await user.type(nameInput, 'John Doe')

      expect(
        screen.queryByText(/name must be at least 2 characters/i)
      ).not.toBeInTheDocument()
    })
  })

  describe('Validation - Email Field', () => {
    it('shows error when email format is invalid', async () => {
      const user = userEvent.setup()
      render(<UserForm />)

      const emailInput = screen.getByLabelText(/email/i)
      await user.type(emailInput, 'invalid-email')

      await waitFor(() => {
        expect(screen.getByText(/invalid email address/i)).toBeInTheDocument()
      })
    })

    it('clears error when email becomes valid', async () => {
      const user = userEvent.setup()
      render(<UserForm />)

      const emailInput = screen.getByLabelText(/email/i)

      await user.type(emailInput, 'invalid')

      await waitFor(() => {
        expect(screen.getByText(/invalid email address/i)).toBeInTheDocument()
      })

      await user.type(emailInput, '@example.com')

      await waitFor(() => {
        expect(
          screen.queryByText(/invalid email address/i)
        ).not.toBeInTheDocument()
      })
    })

    it('does not show error when email is valid', async () => {
      const user = userEvent.setup()
      render(<UserForm />)

      const emailInput = screen.getByLabelText(/email/i)
      await user.type(emailInput, 'john@example.com')

      expect(
        screen.queryByText(/invalid email address/i)
      ).not.toBeInTheDocument()
    })
  })

  describe('Form Submission', () => {
    it('submits form with valid data', async () => {
      const user = userEvent.setup()
      render(<UserForm />)

      const nameInput = screen.getByLabelText(/name/i)
      const emailInput = screen.getByLabelText(/email/i)
      const submitButton = screen.getByRole('button', { name: /submit/i })

      await user.type(nameInput, 'John Doe')
      await user.type(emailInput, 'john@example.com')

      expect(submitButton).not.toBeDisabled()

      await user.click(submitButton)

      await waitFor(
        () => {
          expect(toast.success).toHaveBeenCalledWith(
            'Form submitted successfully!',
            {
              description: 'Welcome, John Doe!',
            }
          )
        },
        { timeout: 2000 }
      )
    })

    it('resets form after successful submission', async () => {
      const user = userEvent.setup()
      render(<UserForm />)

      const nameInput = screen.getByLabelText(/name/i)
      const emailInput = screen.getByLabelText(/email/i)
      const submitButton = screen.getByRole('button', { name: /submit/i })

      await user.type(nameInput, 'John Doe')
      await user.type(emailInput, 'john@example.com')
      await user.click(submitButton)

      await waitFor(
        () => {
          expect(nameInput.value).toBe('')
          expect(emailInput.value).toBe('')
        },
        { timeout: 2000 }
      )
    })

    it('shows success toast after submission', async () => {
      const user = userEvent.setup()
      render(<UserForm />)

      const nameInput = screen.getByLabelText(/name/i)
      const emailInput = screen.getByLabelText(/email/i)
      const submitButton = screen.getByRole('button', { name: /submit/i })

      await user.type(nameInput, 'John Doe')
      await user.type(emailInput, 'john@example.com')
      await user.click(submitButton)

      await waitFor(
        () => {
          expect(toast.success).toHaveBeenCalledWith(
            'Form submitted successfully!',
            {
              description: 'Welcome, John Doe!',
            }
          )
        },
        { timeout: 2000 }
      )
    })
  })

  describe('Accessibility', () => {
    it('has proper form structure', () => {
      const { container } = render(<UserForm />)

      const form = container.querySelector('form')
      expect(form).toBeInTheDocument()
    })

    it('labels are associated with inputs', () => {
      render(<UserForm />)

      const nameInput = screen.getByLabelText(/name/i)
      const emailInput = screen.getByLabelText(/email/i)

      expect(nameInput).toHaveAttribute('id')
      expect(emailInput).toHaveAttribute('id')
    })

    it('error messages have proper styling when shown', async () => {
      const user = userEvent.setup()
      render(<UserForm />)

      const nameInput = screen.getByLabelText(/name/i)

      await user.type(nameInput, 'A')

      await waitFor(() => {
        const errorMessage = screen.getByText(
          /name must be at least 2 characters/i
        )
        expect(errorMessage).toHaveClass(
          'text-sm',
          'text-red-500',
          'dark:text-red-400',
          'font-medium'
        )
      })
    })

    it('inputs have appropriate placeholders', () => {
      render(<UserForm />)

      const nameInput = screen.getByPlaceholderText(/john doe/i)
      const emailInput = screen.getByPlaceholderText(/john@example.com/i)

      expect(nameInput).toBeInTheDocument()
      expect(emailInput).toBeInTheDocument()
    })
  })

  describe('User Interactions', () => {
    it('allows typing in name field', async () => {
      const user = userEvent.setup()
      render(<UserForm />)

      const nameInput = screen.getByLabelText(/name/i)
      await user.type(nameInput, 'Jane Smith')

      expect(nameInput.value).toBe('Jane Smith')
    })

    it('allows typing in email field', async () => {
      const user = userEvent.setup()
      render(<UserForm />)

      const emailInput = screen.getByLabelText(/email/i)
      await user.type(emailInput, 'jane@example.com')

      expect(emailInput.value).toBe('jane@example.com')
    })

    it('validates while typing', async () => {
      const user = userEvent.setup()
      render(<UserForm />)

      const nameInput = screen.getByLabelText(/name/i)

      await user.type(nameInput, 'A')

      await waitFor(() => {
        expect(
          screen.getByText(/name must be at least 2 characters/i)
        ).toBeInTheDocument()
      })
    })

    it('can submit form with keyboard', async () => {
      const user = userEvent.setup()
      render(<UserForm />)

      const nameInput = screen.getByLabelText(/name/i)
      const emailInput = screen.getByLabelText(/email/i)

      await user.type(nameInput, 'John Doe')
      await user.type(emailInput, 'john@example.com')
      await user.keyboard('{Enter}')

      await waitFor(
        () => {
          expect(toast.success).toHaveBeenCalled()
        },
        { timeout: 2000 }
      )
    })
  })
})
