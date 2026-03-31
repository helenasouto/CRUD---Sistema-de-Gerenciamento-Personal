-- VIEW: Alunos por Academia
CREATE VIEW vw_alunos_por_academia AS
SELECT 
  COALESCE(academia, 'Sem Academia') as academia,
  COUNT(*) as total_alunos,
  COUNT(CASE WHEN status = 'ATIVO' THEN 1 END) as ativos,
  COUNT(CASE WHEN status = 'INATIVO' THEN 1 END) as inativos
FROM alunos
GROUP BY academia;

-- PROCEDURE: Aplicar Desconto por Indicação
CREATE OR REPLACE PROCEDURE aplicar_desconto_indicacao(p_aluno_id INT)
LANGUAGE plpgsql
AS $$
DECLARE
  v_desconto_usado BOOLEAN;
  v_pagamento_id INT;
  v_valor_atual NUMERIC;
BEGIN
  SELECT "descontoUsado" INTO v_desconto_usado
  FROM alunos WHERE id = p_aluno_id;

  IF v_desconto_usado = FALSE THEN
    SELECT id, valor INTO v_pagamento_id, v_valor_atual
    FROM pagamentos
    WHERE "alunoId" = p_aluno_id AND status = 'PENDENTE'
    ORDER BY "dataVencimento" ASC
    LIMIT 1;

    IF v_pagamento_id IS NOT NULL THEN
      UPDATE pagamentos
      SET valor = v_valor_atual * 0.90
      WHERE id = v_pagamento_id;

      UPDATE alunos
      SET "descontoUsado" = TRUE
      WHERE id = p_aluno_id;
    END IF;
  END IF;
END;
$$;
