/**
 * Brazilian document formatting utilities
 * Centralized functions for cleaning and formatting CNPJ, CPF, and CEP
 */

/**
 * Removes all non-digit characters from a string
 * @param value - String to clean
 * @returns String with only digits
 */
export function cleanDigits(value: string): string {
  return value.replace(/\D/g, '')
}

/**
 * Cleans CNPJ (removes all non-digit characters)
 * @param cnpj - CNPJ string (may contain formatting)
 * @returns CNPJ with only digits (14 digits)
 */
export function cleanCNPJ(cnpj: string): string {
  return cleanDigits(cnpj)
}

/**
 * Formats CNPJ for display (XX.XXX.XXX/XXXX-XX)
 * @param cnpj - CNPJ string (14 digits)
 * @returns Formatted CNPJ or original string if invalid
 */
export function formatCNPJ(cnpj: string): string {
  if (!cnpj) {
    return ''
  }

  const cleaned = cleanCNPJ(cnpj)
  if (cleaned.length !== 14) {
    return cnpj
  }

  return cleaned.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    '$1.$2.$3/$4-$5'
  )
}

/**
 * Cleans CPF (removes all non-digit characters)
 * @param cpf - CPF string (may contain formatting)
 * @returns CPF with only digits (11 digits)
 */
export function cleanCPF(cpf: string): string {
  return cleanDigits(cpf)
}

/**
 * Formats CPF for display (XXX.XXX.XXX-XX)
 * @param cpf - CPF string (11 digits)
 * @returns Formatted CPF or original string if invalid
 */
export function formatCPF(cpf: string): string {
  if (!cpf) {
    return ''
  }

  const cleaned = cleanCPF(cpf)
  if (cleaned.length !== 11) {
    return cpf
  }

  return cleaned.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4')
}

/**
 * Cleans CEP (removes all non-digit characters)
 * @param cep - CEP string (may contain formatting)
 * @returns CEP with only digits (8 digits)
 */
export function cleanCEP(cep: string): string {
  return cleanDigits(cep)
}

/**
 * Formats CEP for display (XXXXX-XXX)
 * @param cep - CEP string (8 digits)
 * @returns Formatted CEP or original string if invalid
 */
export function formatCEP(cep: string): string {
  if (!cep) {
    return ''
  }

  const cleaned = cleanCEP(cep)
  if (cleaned.length !== 8) {
    return cep
  }

  return cleaned.replace(/^(\d{5})(\d{3})$/, '$1-$2')
}
