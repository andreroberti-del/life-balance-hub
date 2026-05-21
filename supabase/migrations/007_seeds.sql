-- M7 Life Balance: Seed data inicial
-- 2026-05-20 - Overnight build COO
-- Levels + 3 cursos iniciais com módulos e lições

-- 1. Seed dos 5 níveis Duolingo-style
INSERT INTO level_definitions (level, name_en, name_pt, name_es, min_xp, max_xp, badge_color, description_pt, perks) VALUES
  (1, 'Beginner',       'Iniciante',          'Principiante',        0,     499,    '#94AEFF',
   'Começou a jornada. Cada hábito conta.',
   '["Acesso ao app básico","Tracker diário"]'::jsonb),

  (2, 'Engaged',        'Engajado',           'Comprometido',        500,   1999,   '#668DFF',
   'Construindo consistência. O método está tomando forma.',
   '["Badge Engajado","Acesso a cursos básicos","Convidar amigos"]'::jsonb),

  (3, 'Committed',      'Comprometido',       'Dedicado',            2000,  6999,   '#3646F4',
   'Disciplinado. Resultados começam a aparecer.',
   '["Badge Comprometido","Cursos intermediários","Insights avançados ZENO"]'::jsonb),

  (4, 'Master',         'Mestre',             'Maestro',             7000,  29999,  '#2A37D7',
   'Domínio do método OAM. Inspirador para a comunidade.',
   '["Badge Mestre","Todos os cursos","Acesso à comunidade VIP"]'::jsonb),

  (5, 'M7 Master',      'Mestre M7',          'Maestro M7',          30000, 999999, '#FFD700',
   'O maior nível. Liderança de tribo.',
   '["Badge Mestre M7","Curso de distribuidor","Aprovação para ser distribuidor","Reconhecimento na comunidade"]'::jsonb);

-- 2. Cursos iniciais (3 trilhas)
INSERT INTO courses (slug, title_pt, title_en, title_es, description_pt, health_pillar, difficulty, cover_color, estimated_minutes, total_xp_reward, display_order) VALUES
  ('fundamentos-oam',
   'Fundamentos do Omega Audit Method (OAM)',
   'Omega Audit Method Fundamentals',
   'Fundamentos del Omega Audit Method',
   'Aprenda o método que está transformando a relação das pessoas com suplementação de ômega 3. Da ciência por trás à aplicação prática.',
   'fisica', 'beginner', '#668DFF', 60, 200, 1),

  ('inflamacao-101',
   'Inflamação Silenciosa: o inimigo invisível',
   'Silent Inflammation 101',
   'Inflamación Silenciosa 101',
   'Entenda como a inflamação crônica de baixo grau está por trás da maioria das doenças modernas, e como medi-la com biomarcadores reais.',
   'fisica', 'intermediate', '#3646F4', 75, 250, 2),

  ('7-saudes-mind7',
   'As 7 Saúdes do Mind7',
   'The 7 Mind7 Healths',
   'Las 7 Saludes Mind7',
   'A filosofia central do ecossistema Mind7: SER > FAZER > TER. Como cada uma das 7 saúdes se conecta e por que a Física é só o começo.',
   'mental', 'beginner', '#FF004E', 90, 300, 3);

-- 3. Módulos do curso "Fundamentos OAM"
INSERT INTO course_modules (id, course_id, title_pt, title_en, title_es, description_pt, display_order) VALUES
  ('11111111-1111-1111-1111-111111111111',
   (SELECT id FROM courses WHERE slug = 'fundamentos-oam'),
   'Por que seu ômega 3 atual pode não funcionar',
   'Why your current omega 3 may not work',
   'Por qué tu omega 3 actual puede no funcionar',
   'O que separa marca cara de marca eficaz.', 1),

  ('11111111-1111-1111-1111-111111111112',
   (SELECT id FROM courses WHERE slug = 'fundamentos-oam'),
   'O protocolo de 120 dias',
   'The 120-day protocol',
   'El protocolo de 120 días',
   'Baseline, intervenção, reteste. O método científico aplicado a você.', 2),

  ('11111111-1111-1111-1111-111111111113',
   (SELECT id FROM courses WHERE slug = 'fundamentos-oam'),
   'Lendo o seu BalanceTest',
   'Reading your BalanceTest',
   'Leyendo tu BalanceTest',
   'Como interpretar os números. Razão ômega 6:3, AA/EPA, ômega 3 index.', 3);

-- 4. Lições do módulo 1 do curso "Fundamentos OAM"
INSERT INTO course_lessons (module_id, course_id, slug, title_pt, title_en, title_es, lesson_type, content_pt, estimated_minutes, xp_reward, display_order) VALUES
  ('11111111-1111-1111-1111-111111111111',
   (SELECT id FROM courses WHERE slug = 'fundamentos-oam'),
   'rotulo-vs-conteudo',
   'Rótulo não é conteúdo',
   'The label is not the content',
   'La etiqueta no es el contenido',
   'article',
   'A maioria dos suplementos de ômega 3 do mercado tem discrepância entre o que diz no rótulo e o que de fato está dentro da cápsula. Reanalises independentes mostram variação de até 60% entre o EPA declarado e o EPA real. Forma química (ethyl ester vs triglyceride), oxidação (TOTOX) e biodisponibilidade são fatores que o rótulo não te conta. Por isso o OAM começa com diagnóstico antes de prescrição.',
   5, 20, 1),

  ('11111111-1111-1111-1111-111111111111',
   (SELECT id FROM courses WHERE slug = 'fundamentos-oam'),
   'oxidacao-totox',
   'O que é oxidação e por que importa',
   'What is oxidation and why it matters',
   '¿Qué es la oxidación y por qué importa?',
   'article',
   'Ômega 3 oxidado não só não te ajuda como pode prejudicar. A medida usada na indústria é TOTOX (Total Oxidation), que combina valor de peróxido com p-anisidina. Padrões da GOED: TOTOX < 26 é aceitável, < 10 é excelente. Reanalises de marcas populares mostram TOTOX > 26 em 40% dos casos. Comer ômega 3 oxidado equivale a comer óleo rançoso. O OAM testa isso antes de recomendar marca.',
   6, 25, 2),

  ('11111111-1111-1111-1111-111111111111',
   (SELECT id FROM courses WHERE slug = 'fundamentos-oam'),
   'quiz-modulo-1',
   'Quiz: O que você aprendeu',
   'Quiz: What you learned',
   'Quiz: Lo que aprendiste',
   'quiz',
   NULL,
   3, 50, 3);

-- Quiz data pro último item
UPDATE course_lessons SET quiz_data = jsonb_build_object(
  'questions', jsonb_build_array(
    jsonb_build_object(
      'id', 1,
      'question_pt', 'Por que o rótulo de um ômega 3 pode não refletir o conteúdo real?',
      'options_pt', jsonb_build_array(
        'Porque a indústria é regulada estritamente em todo o mundo',
        'Porque há discrepância documentada entre EPA declarado e EPA real em reanalises',
        'Porque o rótulo só importa para suplementos veganos',
        'Porque o EPA é destruído pela embalagem'
      ),
      'correct_index', 1,
      'explanation_pt', 'Reanalises independentes mostram variação de até 60% entre rótulo e conteúdo real.'
    ),
    jsonb_build_object(
      'id', 2,
      'question_pt', 'Qual é o limite aceitável de TOTOX segundo a GOED?',
      'options_pt', jsonb_build_array('< 5', '< 10', '< 26', '< 50'),
      'correct_index', 2,
      'explanation_pt', 'TOTOX < 26 é o limite aceitável. Excelente é < 10.'
    ),
    jsonb_build_object(
      'id', 3,
      'question_pt', 'O que o OAM faz antes de recomendar uma marca?',
      'options_pt', jsonb_build_array(
        'Calcula o preço por mg',
        'Testa diagnóstico com BalanceTest',
        'Compara com a marca da concorrência',
        'Recomenda o mais caro'
      ),
      'correct_index', 1,
      'explanation_pt', 'OAM começa com diagnóstico antes de prescrição.'
    )
  )
) WHERE slug = 'quiz-modulo-1';

-- 5. Módulos e lições do curso "Inflamação 101"
INSERT INTO course_modules (id, course_id, title_pt, title_en, title_es, description_pt, display_order) VALUES
  ('22222222-2222-2222-2222-222222222221',
   (SELECT id FROM courses WHERE slug = 'inflamacao-101'),
   'O que é inflamação crônica',
   'What is chronic inflammation',
   'Qué es la inflamación crónica',
   'A diferença entre inflamação aguda (boa) e crônica (ruim).', 1),

  ('22222222-2222-2222-2222-222222222222',
   (SELECT id FROM courses WHERE slug = 'inflamacao-101'),
   'Biomarcadores que importam',
   'Biomarkers that matter',
   'Biomarcadores que importan',
   'PCR ultra-sensível, IL-6, TNF-alpha, ômega 3 index.', 2);

INSERT INTO course_lessons (module_id, course_id, slug, title_pt, title_en, title_es, lesson_type, content_pt, estimated_minutes, xp_reward, display_order) VALUES
  ('22222222-2222-2222-2222-222222222221',
   (SELECT id FROM courses WHERE slug = 'inflamacao-101'),
   'aguda-vs-cronica',
   'Inflamação aguda vs crônica',
   'Acute vs chronic inflammation',
   'Inflamación aguda vs crónica',
   'article',
   'Quando você corta o dedo, ele incha, fica vermelho, dói. Isso é inflamação aguda. É boa. Sinaliza para o sistema imune trabalhar e cicatrizar. Em poucos dias, passa. Inflamação crônica é diferente. É de baixo grau, silenciosa, constante. Você não sente. Mas ela está corroendo seus tecidos, articulações, vasos sanguíneos. PCR ultra-sensível detecta. A maioria da população moderna vive em estado de inflamação crônica por causa da dieta proinflamatória (alto ômega 6, baixo ômega 3) e estilo de vida sedentário.',
   8, 30, 1),

  ('22222222-2222-2222-2222-222222222222',
   (SELECT id FROM courses WHERE slug = 'inflamacao-101'),
   'omega3-index',
   'Ômega 3 Index: o termômetro da membrana',
   'Omega 3 Index: the membrane thermometer',
   'Omega 3 Index: el termómetro de la membrana',
   'article',
   'Diferente de tomar suplemento e supor que está funcionando, o ômega 3 index mede a % de EPA+DHA nas membranas das suas hemácias. Estudos mostram que pessoas com índice > 8% têm 90% menos risco de morte cardiovascular comparado a quem tem < 4%. A média americana é 4-6%. Brasileira é pior, 3-5%. Esse é o número que importa. E mudança nesse número leva 4 meses (por isso 120 dias do OAM).',
   7, 30, 2);

-- 6. Módulos e lições do curso "7 Saúdes Mind7"
INSERT INTO course_modules (id, course_id, title_pt, title_en, title_es, description_pt, display_order) VALUES
  ('33333333-3333-3333-3333-333333333331',
   (SELECT id FROM courses WHERE slug = '7-saudes-mind7'),
   'A filosofia SER > FAZER > TER',
   'The BE > DO > HAVE philosophy',
   'La filosofía SER > HACER > TENER',
   'Por que treinar o ser muda tudo.', 1),

  ('33333333-3333-3333-3333-333333333332',
   (SELECT id FROM courses WHERE slug = '7-saudes-mind7'),
   'As 7 dimensões integradas',
   'The 7 integrated dimensions',
   'Las 7 dimensiones integradas',
   'Familiar, espiritual, física, financeira, intelectual, profissional, social.', 2);

INSERT INTO course_lessons (module_id, course_id, slug, title_pt, title_en, title_es, lesson_type, content_pt, estimated_minutes, xp_reward, display_order) VALUES
  ('33333333-3333-3333-3333-333333333331',
   (SELECT id FROM courses WHERE slug = '7-saudes-mind7'),
   'origem-mind7',
   'A origem do Mind7',
   'The origin of Mind7',
   'El origen de Mind7',
   'article',
   'Mind7 nasceu da história de Roberti. Empresário de sucesso na faixa dos 30, comprou Ferrari, alcançou metas materiais. Caiu em depressão profunda logo depois. Percebeu que sucesso unidimensional não sustenta um ser humano. Começou a estudar as fundações invisíveis do que faz uma vida funcionar, descobriu 7 dimensões interdependentes. Mind7 é o sistema que treina o SER em cada uma dessas 7 saúdes, antes do FAZER e do TER.',
   10, 40, 1),

  ('33333333-3333-3333-3333-333333333332',
   (SELECT id FROM courses WHERE slug = '7-saudes-mind7'),
   'as-7-saudes-mapa',
   'O mapa das 7 saúdes',
   'The 7 healths map',
   'El mapa de las 7 saludes',
   'article',
   'Saúde Familiar: nenhum sucesso financeiro justifica o fracasso de uma família. Saúde Espiritual: cresça por fora sem se perder por dentro. Saúde Física: corpo fraco não sustenta espírito e mente forte. Saúde Financeira: dinheiro é um ótimo servo, mas um péssimo senhor. Saúde Intelectual: ser é maior do que ter. Saúde Profissional: alta performance exige clareza, metas e método. Saúde Social: você é a média das conversas que sustenta. As 7 são interdependentes. Tratar uma sem as outras é fracasso parcial.',
   12, 50, 2),

  ('33333333-3333-3333-3333-333333333332',
   (SELECT id FROM courses WHERE slug = '7-saudes-mind7'),
   'reflexao-suas-7',
   'Reflexão: onde você está em cada uma',
   'Reflection: where you are in each one',
   'Reflexión: dónde estás en cada una',
   'reflection',
   'Antes da próxima lição, escreva onde você se vê hoje em cada uma das 7 saúdes em uma escala de 0 a 10. Não há resposta certa. O exercício é o mapa.',
   8, 40, 3);
