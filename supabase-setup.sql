-- Tabela de projetos
CREATE TABLE IF NOT EXISTS projetos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  titulo TEXT NOT NULL,
  tipologia TEXT NOT NULL DEFAULT 'corporativo',
  status TEXT NOT NULL DEFAULT 'rascunho',
  dados JSONB NOT NULL DEFAULT '{}',
  criado_em TIMESTAMPTZ DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ DEFAULT NOW()
);

-- Ativar Row Level Security
ALTER TABLE projetos ENABLE ROW LEVEL SECURITY;

-- Cada usuário vê e edita apenas os seus projetos
CREATE POLICY "usuario_gerencia_proprios_projetos" ON projetos
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Índice para busca por usuário
CREATE INDEX IF NOT EXISTS projetos_user_id_idx ON projetos(user_id);
CREATE INDEX IF NOT EXISTS projetos_atualizado_em_idx ON projetos(atualizado_em DESC);
