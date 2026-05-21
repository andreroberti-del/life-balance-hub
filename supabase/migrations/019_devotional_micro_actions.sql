-- M7 Life Balance: Devotional micro-actions
-- 2026-05-21
-- Princípio Duolingo: começar absurdamente pequeno (1-3 min) e crescer gradualmente.
-- "20 minutos em silêncio" pra iniciante mata o hábito. Comece em 1 min.

ALTER TABLE devotionals ADD COLUMN IF NOT EXISTS action_starter_minutes INTEGER DEFAULT 2;
ALTER TABLE devotionals ADD COLUMN IF NOT EXISTS action_progression_pt TEXT;

-- Reescrever ações dos 5 devocionais com micro-progressão
UPDATE devotionals SET
  action_pt = 'Coloque um cronômetro de 2 minutos. Apenas respire e observe. Sem celular. Sem nada. Só 2 minutos.',
  action_starter_minutes = 2,
  action_progression_pt = 'Semana 1: 2 min/dia. Semana 2: 5 min. Semana 4: 10 min. Mês 3: 20 min. O músculo do silêncio se constrói gradual, como qualquer outro.'
WHERE slug = 'silencio-sabio';

UPDATE devotionals SET
  action_pt = 'Pegue o celular. Mande UMA mensagem agora pra alguém da sua família. Algo simples: "tava pensando em você, te amo". Só isso. 30 segundos.',
  action_starter_minutes = 1,
  action_progression_pt = 'Hoje: 1 mensagem. Esta semana: 3 mensagens diferentes. Próxima semana: uma ligação curta. Mês 2: um café marcado.'
WHERE slug = 'familia-fundacao';

UPDATE devotionals SET
  action_pt = 'Escreva agora 1 coisa pela qual você é grato. Só 1. Pode ser bobagem. Pode ser o café da manhã.',
  action_starter_minutes = 1,
  action_progression_pt = 'Hoje: 1 item. Semana 2: 3 itens. Mês 1: 3 itens + por quê. Mês 3: gratidão por algo difícil. Comece pequeno.'
WHERE slug = 'gratidao-mecanismo';

UPDATE devotionals SET
  action_pt = 'Liste UMA pessoa que será impactada pela vida que você está construindo. Só uma. Pode ser você mesmo daqui 10 anos.',
  action_starter_minutes = 2,
  action_progression_pt = 'Hoje: 1 pessoa. Semana 2: 3 pessoas + como. Mês 1: o que vai deixar pra cada uma. Mês 6: revisa e ajusta.'
WHERE slug = 'proposito-acima-do-numero';

UPDATE devotionals SET
  action_pt = 'Feche os olhos por 3 minutos. Sem dormir. Só descansar. Cronômetro do celular. 3 minutos.',
  action_starter_minutes = 3,
  action_progression_pt = 'Hoje: 3 min. Semana 2: 5 min. Mês 1: 15 min. Mês 3: tarde inteira reservada. Mês 6: 1 dia/semana sem agenda.'
WHERE slug = 'descanso-em-deus';
