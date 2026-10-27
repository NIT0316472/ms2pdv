-- Script de Migração: Adicionar campo payment_method na tabela sales
-- Formas de pagamento permitidas: 'PIX', 'DEBIT_CARD' (Cartão de Débito), 'CREDIT_CARD' (Cartão de Crédito)

ALTER TABLE sales
ADD COLUMN payment_method ENUM('PIX', 'DEBIT_CARD', 'CREDIT_CARD') NOT NULL DEFAULT 'PIX'
AFTER total;
