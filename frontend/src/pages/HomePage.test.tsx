import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@/test/test-utils'
import { userEvent } from '@testing-library/user-event'
import HomePage from './HomePage'
import { toast } from 'sonner'

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
  },
}))

describe('HomePage', () => {
  it('renders the main heading', () => {
    render(<HomePage />)
    const heading = screen.getByRole('heading', {
      name: /welcome to your react app/i,
    })
    expect(heading).toBeInTheDocument()
  })

  it('renders the description text', () => {
    render(<HomePage />)
    const description = screen.getByText(/built with vite, react, typescript/i)
    expect(description).toBeInTheDocument()
  })

  it('renders Get Started button', () => {
    render(<HomePage />)
    const button = screen.getByRole('button', { name: /get started/i })
    expect(button).toBeInTheDocument()
  })

  it('renders Learn More link', () => {
    render(<HomePage />)
    const link = screen.getByRole('link', { name: /learn more/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', 'https://github.com')
    expect(link).toHaveAttribute('target', '_blank')
  })

  it('shows success toast when Get Started button is clicked', async () => {
    const user = userEvent.setup()
    render(<HomePage />)

    const button = screen.getByRole('button', { name: /get started/i })
    await user.click(button)

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Welcome to the application!')
    })
  })

  describe('Feature Cards', () => {
    it('renders all six feature cards', () => {
      render(<HomePage />)

      expect(screen.getByText(/⚡ lightning fast/i)).toBeInTheDocument()
      expect(screen.getByText(/🎨 beautiful ui/i)).toBeInTheDocument()
      expect(screen.getByText(/🔒 type safe/i)).toBeInTheDocument()
      expect(screen.getByText(/📡 smart data/i)).toBeInTheDocument()
      expect(screen.getByText(/📝 forms made easy/i)).toBeInTheDocument()
      expect(screen.getByText(/🎯 best practices/i)).toBeInTheDocument()
    })

    it('renders Lightning Fast card with correct description', () => {
      render(<HomePage />)

      expect(
        screen.getByText(/powered by vite for instant hmr/i)
      ).toBeInTheDocument()
      expect(
        screen.getByText(/experience blazing fast development/i)
      ).toBeInTheDocument()
    })

    it('renders Beautiful UI card with correct description', () => {
      render(<HomePage />)

      expect(
        screen.getByText(/shadcn\/ui components with tailwind css/i)
      ).toBeInTheDocument()
      expect(
        screen.getByText(/high-quality, accessible components/i)
      ).toBeInTheDocument()
    })

    it('renders Type Safe card with correct description', () => {
      render(<HomePage />)

      expect(
        screen.getByText(/full typescript support with zod validation/i)
      ).toBeInTheDocument()
      expect(
        screen.getByText(/catch errors early with typescript/i)
      ).toBeInTheDocument()
    })
  })

  describe('Form Section', () => {
    it('renders form section heading', () => {
      render(<HomePage />)

      const formHeading = screen.getByRole('heading', { name: /try the form/i })
      expect(formHeading).toBeInTheDocument()
    })

    it('renders form description', () => {
      render(<HomePage />)

      expect(
        screen.getByText(/example form using tanstack form/i)
      ).toBeInTheDocument()
    })

    it('renders form footer text', () => {
      render(<HomePage />)

      expect(
        screen.getByText(/this form demonstrates real-time validation/i)
      ).toBeInTheDocument()
    })

    it('renders name and email input fields', () => {
      render(<HomePage />)

      const nameInput = screen.getByLabelText(/name/i)
      const emailInput = screen.getByLabelText(/email/i)

      expect(nameInput).toBeInTheDocument()
      expect(emailInput).toBeInTheDocument()
    })

    it('renders submit button', () => {
      render(<HomePage />)

      const submitButton = screen.getByRole('button', { name: /submit/i })
      expect(submitButton).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has proper heading hierarchy', () => {
      render(<HomePage />)

      const mainHeading = screen.getByRole('heading', { level: 1 })
      expect(mainHeading).toHaveTextContent(/welcome to your react app/i)
    })

    it('all links have accessible names', () => {
      render(<HomePage />)

      const links = screen.getAllByRole('link')
      links.forEach((link) => {
        expect(link).toHaveAccessibleName()
      })
    })

    it('all buttons have accessible names', () => {
      render(<HomePage />)

      const buttons = screen.getAllByRole('button')
      buttons.forEach((button) => {
        expect(button).toHaveAccessibleName()
      })
    })
  })

  describe('Responsive Design', () => {
    it('renders container with proper classes', () => {
      const { container } = render(<HomePage />)

      const mainContainer = container.querySelector('.container')
      expect(mainContainer).toBeInTheDocument()
      expect(mainContainer).toHaveClass('mx-auto', 'px-4', 'py-16')
    })

    it('renders grid layout for feature cards', () => {
      const { container } = render(<HomePage />)

      const grid = container.querySelector('.grid')
      expect(grid).toBeInTheDocument()
      expect(grid).toHaveClass('md:grid-cols-2', 'lg:grid-cols-3')
    })
  })
})
