import { Card, CardContent } from '@/components/ui/card'
import UsersIcon from '@/assets/icons/users.svg'
import AuthorizationsIcon from '@/assets/icons/authorization.svg'
import PharmaciesIcon from '@/assets/icons/pharmacies.svg'
import { UsersAttendedChart } from '@/components/users-attended-chart'
import { DrugAuthorizations } from '@/components/drug-authorizations'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background" data-qa="dashboard-page">
      <div className="mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 max-w-7xl">
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          data-qa="dashboard-stats"
        >
          <Card
            className="grid grid-cols-[auto_1fr] gap-3 sm:gap-4 md:gap-6 border-[#00A91C] border rounded-md min-h-[90px] sm:min-h-[100px] p-3 sm:p-4"
            data-qa="stat-card-active-users"
          >
            <CardContent className="p-0 flex items-center">
              <img
                src={UsersIcon}
                alt="users"
                className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14"
              />
            </CardContent>
            <CardContent className="p-0 flex flex-col justify-center">
              <p
                className="text-xl sm:text-2xl text-[#00A91C] font-bold"
                data-qa="active-users-count"
              >
                687
              </p>
              <p className="text-sm sm:text-base font-semibold text-[#454540] dark:text-muted-foreground">
                Usuários Ativos
              </p>
            </CardContent>
          </Card>
          <Card
            className="grid grid-cols-[auto_1fr] gap-3 sm:gap-4 md:gap-6 border-[#FF580A] border rounded-md min-h-[90px] sm:min-h-[100px] p-3 sm:p-4"
            data-qa="stat-card-authorizations"
          >
            <CardContent className="p-0 flex items-center">
              <img
                src={AuthorizationsIcon}
                alt="authorizations"
                className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14"
              />
            </CardContent>
            <CardContent className="p-0 flex flex-col justify-center">
              <p
                className="text-xl sm:text-2xl text-[#FF580A] font-bold"
                data-qa="authorizations-count"
              >
                687
              </p>
              <p className="text-sm sm:text-base font-semibold text-[#454540] dark:text-muted-foreground">
                Autorizações Realizadas
              </p>
            </CardContent>
          </Card>
          <Card
            className="grid grid-cols-[auto_1fr] gap-3 sm:gap-4 md:gap-6 border-[#2378C3] border rounded-md min-h-[90px] sm:min-h-[100px] p-3 sm:p-4 sm:col-span-2 lg:col-span-1"
            data-qa="stat-card-pharmacies"
          >
            <CardContent className="p-0 flex items-center">
              <img
                src={PharmaciesIcon}
                alt="medications"
                className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14"
              />
            </CardContent>
            <CardContent className="p-0 flex flex-col justify-center">
              <p
                className="text-xl sm:text-2xl text-[#2378C3] font-bold"
                data-qa="pharmacies-count"
              >
                687
              </p>
              <p className="text-sm sm:text-base font-semibold text-[#454540] dark:text-muted-foreground">
                Farmácias/Drogarias Ativas
              </p>
            </CardContent>
          </Card>
        </div>
        <div
          className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 pt-4 sm:pt-6"
          data-qa="dashboard-charts"
        >
          <Card data-qa="users-attended-chart-card">
            <CardContent className="p-4 sm:p-6">
              <p className="mb-4 text-sm sm:text-base">Usuários atentidos</p>
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4">
                <UsersAttendedChart />
                <div className="flex flex-col justify-center items-center sm:items-start">
                  <p
                    className="text-xl sm:text-2xl text-[#00A91C] font-bold text-center sm:text-left"
                    data-qa="total-users-year"
                  >
                    687
                  </p>
                  <p className="text-sm sm:text-base font-semibold text-[#454540] text-center sm:text-left">
                    Total no ano
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card data-qa="drug-authorizations-card">
            <CardContent className="p-4 sm:p-6">
              <p className="mb-4 text-sm sm:text-base">
                Autorizações por Medicamentos
              </p>
              <div className="overflow-x-auto">
                <DrugAuthorizations />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
