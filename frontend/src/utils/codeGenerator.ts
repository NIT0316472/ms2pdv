/**
 * Gerador de códigos aleatórios no formato: 2 letras e 3 números (ex: AB123).
 *
 * Utilizado para geração automática de códigos de produtos da Singularidade.
 */

export function generateRandomCode(prefixLength: number = 2, numberLength: number = 3): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let prefix = '';
  for (let i = 0; i < prefixLength; i++) {
    prefix += letters[Math.floor(Math.random() * letters.length)];
  }

  // Gera número de 3 dígitos com zero à esquerda garantido (000 a 999)
  const max = Math.pow(10, numberLength);
  const num = String(Math.floor(Math.random() * max)).padStart(numberLength, '0');

  return `${prefix}${num}`;
}

