/**
 * Safely parses organization metadata JSON string
 * @param metadata - JSON string from organization.metadata field
 * @returns Parsed object or null if parsing fails
 */
export function parseOrganizationMetadata(
  metadata: string | Record<string, unknown> | null | undefined
): Record<string, unknown> | null {
  if (!metadata) return null

  // If it's already an object, return it
  if (typeof metadata === 'object') {
    return metadata
  }

  try {
    const parsed = JSON.parse(metadata) as Record<string, unknown>

    return typeof parsed === 'object' ? parsed : null
  } catch (error) {
    console.error('Failed to parse organization metadata:', error)
    return null
  }
}

/**
 * Formats Brazilian phone number
 * @param phone - Phone string
 * @returns Formatted phone
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')

  if (cleaned.length === 11) {
    return cleaned.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3')
  }
  if (cleaned.length === 10) {
    return cleaned.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3')
  }

  return phone
}

/**
 * Maps role codes to display names in Portuguese (uppercase)
 * @param role - Role code string
 * @returns Display name in Portuguese (uppercase) or the role code in uppercase if not found
 */
export function getRoleDisplayName(role?: string): string {
  const roleMap: Record<string, string> = {
    masterFp: 'MASTER FP',
    analistaFp: 'ANALISTA FP',
    financeiroFp: 'FINANCEIRO FP',
    consultaFp: 'CONSULTA FP',
    representanteLegal: 'REPRESENTANTE LEGAL',
    gestor: 'GESTOR',
    vendedor: 'VENDEDOR',
    owner: 'PROPRIETÁRIO',
    admin: 'ADMINISTRADOR',
    member: 'MEMBRO',
  }

  return role ? (roleMap[role] ?? role.toUpperCase()) : 'SEM PERFIL'
}
