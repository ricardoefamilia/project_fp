import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@/test/test-utils'
import { userEvent } from '@testing-library/user-event'
import NotFoundPage from './NotFoundPage'

const mockNavigate = vi.fn()
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('NotFoundPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
  })

  it('renders 404 heading', () => {
    render(<NotFoundPage />)

    const heading = screen.getByRole('heading', { name: '404' })
    expect(heading).toBeInTheDocument()
  })

  it('renders error message', () => {
    render(<NotFoundPage />)

    const message = screen.getByText(
      /oops! the page you're looking for doesn't exist/i
    )
    expect(message).toBeInTheDocument()
  })

  it('renders Go Home button', () => {
    render(<NotFoundPage />)

    const button = screen.getByRole('button', { name: /go home/i })
    expect(button).toBeInTheDocument()
  })

  it('navigates to home when Go Home button is clicked', async () => {
    const user = userEvent.setup()
    render(<NotFoundPage />)

    const button = screen.getByRole('button', { name: /go home/i })
    await user.click(button)

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/')
    })
  })

  describe('Layout', () => {
    it('renders card container', () => {
      const { container } = render(<NotFoundPage />)

      const card = container.querySelector('.max-w-md')
      expect(card).toBeInTheDocument()
    })

    it('has centered layout', () => {
      const { container } = render(<NotFoundPage />)

      const mainDiv = container.firstChild
      expect(mainDiv).toHaveClass(
        'flex',
        'min-h-screen',
        'items-center',
        'justify-center'
      )
    })

    it('applies gradient background', () => {
      const { container } = render(<NotFoundPage />)

      const mainDiv = container.firstChild
      expect(mainDiv).toHaveClass('bg-gradient-to-b')
    })
  })

  describe('Accessibility', () => {
    it('has proper heading hierarchy', () => {
      render(<NotFoundPage />)

      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toHaveTextContent('404')
    })

    it('button has accessible name', () => {
      render(<NotFoundPage />)

      const button = screen.getByRole('button', { name: /go home/i })
      expect(button).toHaveAccessibleName()
    })

    it('has descriptive error message', () => {
      render(<NotFoundPage />)

      const message = screen.getByText(/oops!/i)
      expect(message).toBeInTheDocument()
    })
  })

  describe('Button Styling', () => {
    it('button has full width class', () => {
      render(<NotFoundPage />)

      const button = screen.getByRole('button', { name: /go home/i })
      expect(button).toHaveClass('w-full')
    })

    it('button is enabled', () => {
      render(<NotFoundPage />)

      const button = screen.getByRole('button', { name: /go home/i })
      expect(button).not.toBeDisabled()
    })
  })
})
