import { useForm } from '@tanstack/react-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

export function UserForm() {
  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
    },
    onSubmit: async ({ value }) => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log('Form submitted:', value)
      toast.success('Form submitted successfully!', {
        description: `Welcome, ${value.name}!`,
      })
      form.reset()
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        void form.handleSubmit()
      }}
      className="space-y-6"
      data-qa="user-form"
    >
      <form.Field
        name="name"
        validators={{
          onChange: ({ value }) => {
            if (!value || value.length < 2) {
              return 'Name must be at least 2 characters'
            }
            return undefined
          },
        }}
        children={(field) => (
          <div className="space-y-2">
            <Label
              htmlFor={field.name}
              className="text-slate-700 dark:text-slate-200 text-base"
            >
              Name
            </Label>
            <Input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              placeholder="John Doe"
              data-qa="user-form-name-input"
            />
            {field.state.meta.errors.length > 0 && (
              <p
                className="text-sm text-red-500 dark:text-red-400 font-medium"
                data-qa="user-form-name-error"
              >
                {field.state.meta.errors[0]}
              </p>
            )}
          </div>
        )}
      />

      <form.Field
        name="email"
        validators={{
          onChange: ({ value }) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!value || !emailRegex.test(value)) {
              return 'Invalid email address'
            }
            return undefined
          },
        }}
        children={(field) => (
          <div className="space-y-2">
            <Label
              htmlFor={field.name}
              className="text-slate-700 dark:text-slate-200 text-base"
            >
              Email
            </Label>
            <Input
              id={field.name}
              name={field.name}
              type="email"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              placeholder="john@example.com"
              data-qa="user-form-email-input"
            />
            {field.state.meta.errors.length > 0 && (
              <p
                className="text-sm text-red-500 dark:text-red-400 font-medium"
                data-qa="user-form-email-error"
              >
                {field.state.meta.errors[0]}
              </p>
            )}
          </div>
        )}
      />

      <Button
        type="submit"
        className="w-full"
        disabled={form.state.isSubmitting}
        data-qa="user-form-submit-button"
      >
        {form.state.isSubmitting ? 'Submitting...' : 'Submit'}
      </Button>
    </form>
  )
}
