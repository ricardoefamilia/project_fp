// import { useTranslation } from 'react-i18next'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useTheme } from '@/hooks/use-theme'
import { Moon, Sun, Monitor /*Languages*/ } from 'lucide-react'

// const languages = [
//   { code: 'pt-BR', name: 'Português', flag: '🇧🇷' },
//   { code: 'en-US', name: 'English', flag: '🇺🇸' },
// ]

const themes = [
  { value: 'light', name: 'Claro', icon: Sun },
  { value: 'dark', name: 'Escuro', icon: Moon },
  { value: 'system', name: 'Sistema', icon: Monitor },
]

export default function Settings() {
  // const { t, i18n } = useTranslation()
  const { theme, setTheme } = useTheme()

  // const changeLanguage = (languageCode: string) => {
  //   i18n.changeLanguage(languageCode)
  // }

  // const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0]

  return (
    <div
      className="container mx-auto p-4 sm:p-6 max-w-2xl"
      data-qa="settings-page"
    >
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Configurações</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Configurações do sistema
        </p>
      </div>

      <div className="space-y-6">
        {/* Theme Settings */}
        <Card data-qa="theme-settings-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sun className="h-5 w-5" />
              Tema
            </CardTitle>
            <CardDescription>Selecione o tema do sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="theme-select">Tema</Label>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger id="theme-select" data-qa="theme-select-trigger">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent data-qa="theme-select-content">
                  {themes.map((themeOption) => {
                    const Icon = themeOption.icon
                    return (
                      <SelectItem
                        key={themeOption.value}
                        value={themeOption.value}
                        data-qa={`theme-option-${themeOption.value}`}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          <span>{themeOption.name}</span>
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Language Settings */}
        {/* <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Languages className="h-5 w-5" />
              {t('settings.language.title')}
            </CardTitle>
            <CardDescription>
              {t('settings.language.description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="language-select">{t('settings.language.label')}</Label>
              <Select value={currentLanguage.code} onValueChange={changeLanguage}>
                <SelectTrigger id="language-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((language) => (
                    <SelectItem key={language.code} value={language.code}>
                      <div className="flex items-center gap-2">
                        <span>{language.flag}</span>
                        <span>{language.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card> */}
      </div>
    </div>
  )
}
