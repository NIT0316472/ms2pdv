/**
 * Gerador de códigos aleatórios no formato: 3 letras e 3 números separados por hífen (ex: CAM-001, ABC-123).
 * Formato: XXX-000
 *
 * Utilizado para geração automática de códigos/SKU de produtos da Singularidade.
 */

export function generateRandomCode(prefixLength: number = 3, numberLength: number = 3): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let prefix = '';
  for (let i = 0; i < prefixLength; i++) {
    prefix += letters[Math.floor(Math.random() * letters.length)];
  }

  // Gera número de 3 dígitos com zero à esquerda garantido (ex: 001 até 999)
  const max = Math.pow(10, numberLength);
  const num = String(Math.floor(Math.random() * max)).padStart(numberLength, '0');

  return `${prefix}-${num}`;
}
