import { LoginForm } from '@/components/LoginForm'
import logoGov from '@/assets/images/logo-gov.svg'
import logoEsus from '@/assets/images/logo-esus.svg'

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2" data-qa="login-page">
      <div
        className="flex flex-col gap-4 sm:gap-6 p-4 sm:p-6 md:p-8 lg:p-10"
        data-qa="login-form-container"
      >
        <div className="flex justify-center items-center gap-4 sm:gap-6 pt-4 sm:pt-6">
          <img
            src={logoGov}
            alt="Logo do Governo Federal"
            className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24"
            data-qa="logo-gov"
          />
          <img
            src={logoEsus}
            alt="Logo do ESUS"
            className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32"
            data-qa="logo-esus"
          />
        </div>
        <div className="flex flex-1 items-center justify-center py-4 sm:py-6">
          <div className="w-full max-w-xs sm:max-w-sm">
            <LoginForm />
          </div>
        </div>
      </div>
      <div
        className="bg-red-500 bg-[url('@/assets/images/bg-login.svg')] bg-cover bg-center bg-no-repeat relative hidden lg:flex items-center justify-start h-full pl-12 xl:pl-20"
        data-qa="login-banner"
      >
        <p className="text-white text-3xl xl:text-4xl 2xl:text-5xl font-bold max-w-md px-4">
          Programa <br /> Farmácia Popular <br /> do Brasil
        </p>
      </div>
    </div>
  )
}
