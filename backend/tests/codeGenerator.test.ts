import { describe, expect, it } from 'vitest';
import { generateRandomCode } from '../src/utils/codeGenerator';
import { generateProductCode } from '../src/controllers/productController';

describe('Gerador de Códigos Aleatórios (2 letras e 3 números)', () => {
  it('gera código no formato exato de 2 letras maiúsculas seguidas por 3 dígitos numéricos', () => {
    const regex = /^[A-Z]{2}[0-9]{3}$/;

    for (let i = 0; i < 100; i++) {
      const code = generateRandomCode(2, 3);
      expect(code).toMatch(regex);
      expect(code.length).toBe(5);
    }
  });

  it('generateProductCode() gera código compatível com o padrão do sistema', () => {
    const regex = /^[A-Z]{2}[0-9]{3}$/;

    for (let i = 0; i < 50; i++) {
      const code = generateProductCode();
      expect(code).toMatch(regex);
      expect(code.length).toBe(5);
    }
  });

  it('gera códigos variados e com baixa probabilidade de colisão imediata', () => {
    const codes = new Set<string>();
    for (let i = 0; i < 50; i++) {
      codes.add(generateRandomCode(2, 3));
    }
    // Em 50 gerações em um universo de 676.000, espera-se quase todos únicos
    expect(codes.size).toBeGreaterThanOrEqual(48);
  });
});

