import { describe, expect, it } from 'vitest';
import { generateRandomCode } from '../src/utils/codeGenerator';
import { generateProductCode } from '../src/controllers/productController';

describe('Gerador de Códigos Aleatórios (3 letras e 3 números: XXX-000)', () => {
  it('gera código no formato exato de 3 letras maiúsculas seguidas de hífen e 3 dígitos numéricos (XXX-000)', () => {
    const regex = /^[A-Z]{3}-[0-9]{3}$/;

    for (let i = 0; i < 100; i++) {
      const code = generateRandomCode(3, 3);
      expect(code).toMatch(regex);
      expect(code.length).toBe(7);
    }
  });

  it('generateProductCode() gera código compatível com o padrão do sistema (XXX-000)', () => {
    const regex = /^[A-Z]{3}-[0-9]{3}$/;

    for (let i = 0; i < 50; i++) {
      const code = generateProductCode();
      expect(code).toMatch(regex);
      expect(code.length).toBe(7);
    }
  });

  it('gera códigos variados e com baixíssima probabilidade de colisão', () => {
    const codes = new Set<string>();
    for (let i = 0; i < 50; i++) {
      codes.add(generateRandomCode(3, 3));
    }
    // Em 50 gerações em um universo de 17.576.000, espera-se todos únicos
    expect(codes.size).toBe(50);
  });
});
