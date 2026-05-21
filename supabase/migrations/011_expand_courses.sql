-- M7 Life Balance: Expansão de cursos
-- Adiciona 18+ lições aos 8 módulos placeholder

-- Módulo: O protocolo de 120 dias (Fundamentos OAM)
INSERT INTO course_lessons (module_id, course_id, slug, title_pt, title_en, title_es, lesson_type, content_pt, estimated_minutes, xp_reward, display_order) VALUES
  ('11111111-1111-1111-1111-111111111112',
   (SELECT id FROM courses WHERE slug = 'fundamentos-oam'),
   'protocolo-120-overview',
   'Por que 120 dias e não 30',
   'Why 120 days, not 30',
   'Por qué 120 días, no 30',
   'article',
   'O ômega 3 leva tempo pra mudar a composição das membranas das suas células. Estudos mostram que o ômega 3 index demora entre 90 e 120 dias para responder plenamente a uma intervenção. 30 dias mostra mudança no plasma sanguíneo, mas não na membrana. E é a membrana que importa. Por isso o protocolo OAM é 120 dias: tempo suficiente pra mudança estrutural, não só circulação.',
   6, 25, 1),
  ('11111111-1111-1111-1111-111111111112',
   (SELECT id FROM courses WHERE slug = 'fundamentos-oam'),
   'baseline-medicao',
   'O baseline: medindo antes de mudar',
   'The baseline: measuring before changing',
   'El baseline: midiendo antes de cambiar',
   'article',
   'Antes de mudar qualquer coisa, fazemos o BalanceTest. É um teste de gota seca, você se coleca em casa, manda pro laboratório, recebe seu ômega 3 index, sua razão AA/EPA e seu omega 6/3. Esse é o ponto zero. Sem ele, você está agindo no escuro. Com ele, você tem o termômetro que vai medir cada decisão que tomar nos próximos 4 meses.',
   5, 25, 2),
  ('11111111-1111-1111-1111-111111111112',
   (SELECT id FROM courses WHERE slug = 'fundamentos-oam'),
   'reteste-prova',
   'O reteste: a prova que o corpo mudou',
   'The retest: proof your body changed',
   'El retest: la prueba que tu cuerpo cambió',
   'reflection',
   'Aos 120 dias você refaz o teste. Compara. Se você seguiu o protocolo de verdade, sua razão AA/EPA caiu de 15-20:1 para algo próximo de 3:1. Seu omega 3 index subiu pra >8%. Os números falam por si. E aqui é onde você decide: ou volta a fazer só por intuição, ou adota o método pelo resto da vida. Reflexão: o que você espera ver nos seus números aos 120 dias?',
   8, 40, 3);

-- Módulo: Lendo o seu BalanceTest (Fundamentos OAM)
INSERT INTO course_lessons (module_id, course_id, slug, title_pt, title_en, title_es, lesson_type, content_pt, estimated_minutes, xp_reward, display_order) VALUES
  ('11111111-1111-1111-1111-111111111113',
   (SELECT id FROM courses WHERE slug = 'fundamentos-oam'),
   'omega3-index-detalhe',
   'Ômega 3 Index, em profundidade',
   'Omega 3 Index in depth',
   'Omega 3 Index en detalle',
   'article',
   'O ômega 3 index é a porcentagem de EPA+DHA nas membranas das suas hemácias. Hemácias vivem 120 dias, então elas refletem o consumo crônico, não o que você comeu ontem. Faixas: > 8% (cardio-protetivo, ideal), 4-8% (médio, risco moderado), < 4% (alto risco). Americanos média 4-6%, brasileiros média 3-5%, japoneses média 9-11%. O Japão tem a menor incidência de morte cardiovascular do mundo, e isso correlaciona com ômega 3 index alto.',
   7, 30, 1),
  ('11111111-1111-1111-1111-111111111113',
   (SELECT id FROM courses WHERE slug = 'fundamentos-oam'),
   'razao-aa-epa',
   'Razão AA/EPA, o predador da inflamação',
   'AA/EPA Ratio, inflammation predictor',
   'Ratio AA/EPA, predictor de inflamación',
   'article',
   'Ácido araquidônico (AA) é um ômega 6 que vira moléculas pró-inflamatórias. EPA compete diretamente com AA pelas mesmas enzimas. Se você tem 20x mais AA que EPA, seu corpo está fabricando 20x mais sinais inflamatórios do que anti. A meta é < 3:1. Americanos têm 15-20:1. Esse é talvez o número mais subestimado em medicina preventiva. Diferente do colesterol, ele responde rápido (60-120 dias) com intervenção dietética + suplementação correta.',
   8, 30, 2),
  ('11111111-1111-1111-1111-111111111113',
   (SELECT id FROM courses WHERE slug = 'fundamentos-oam'),
   'razao-omega-6-3',
   'Razão Ômega 6/3, o quadro completo',
   'Omega 6/3 Ratio, the full picture',
   'Ratio Omega 6/3, el cuadro completo',
   'article',
   'Enquanto AA/EPA olha pro celular, omega 6/3 olha pro plasma. Ambos contam histórias complementares. Razão 6/3 americana padrão: 15-20:1. Razão pré-industrial estimada: 1-4:1. A dieta moderna tem ÓLEOS VEGETAIS demais (soja, milho, girassol) que são ômega 6 puro, e POUCO peixe de água fria. Resultado: equilíbrio sistêmico pró-inflamatório. Reduzir ômega 6 e aumentar ômega 3 é a equação completa.',
   7, 30, 3);

-- Módulo: Biomarcadores que importam (Inflamação 101)
INSERT INTO course_lessons (module_id, course_id, slug, title_pt, title_en, title_es, lesson_type, content_pt, estimated_minutes, xp_reward, display_order) VALUES
  ('22222222-2222-2222-2222-222222222222',
   (SELECT id FROM courses WHERE slug = 'inflamacao-101'),
   'pcr-ultra',
   'PCR ultra-sensível, o termômetro sistêmico',
   'High-sensitivity CRP, the systemic thermometer',
   'PCR ultrasensible, el termómetro sistémico',
   'article',
   'Proteína C-reativa é produzida pelo fígado em resposta a IL-6. PCR é o biomarcador mais usado pra inflamação sistêmica. Versão ultra-sensível (hs-CRP) detecta níveis baixos crônicos, não só inflamação aguda. Valor de risco cardiovascular: < 1 baixo, 1-3 médio, > 3 alto. EPA em doses 2-4g/dia reduz PCR em 25-30% em 12 semanas. É um dos efeitos mais bem documentados do ômega 3.',
   8, 30, 2),
  ('22222222-2222-2222-2222-222222222222',
   (SELECT id FROM courses WHERE slug = 'inflamacao-101'),
   'il6-tnf',
   'IL-6 e TNF-α, as citocinas da tempestade',
   'IL-6 and TNF-alpha, the storm cytokines',
   'IL-6 y TNF-alfa, las citocinas de la tormenta',
   'article',
   'IL-6 (interleucina 6) e TNF-α (tumor necrosis factor alfa) são citocinas pró-inflamatórias centrais. Estão elevadas em obesidade, diabetes tipo 2, doenças autoimunes, sepse e até depressão. EPA inibe o NF-κB, fator de transcrição que ativa essas citocinas. Não é placebo: meta-análises confirmam redução clinicamente significativa com doses adequadas. Quando você baixa essas citocinas, todo o sistema desinflama.',
   8, 30, 3),
  ('22222222-2222-2222-2222-222222222222',
   (SELECT id FROM courses WHERE slug = 'inflamacao-101'),
   'quiz-biomarcadores',
   'Quiz: você entende os biomarcadores?',
   'Quiz: do you get the biomarkers?',
   'Quiz: entiendes los biomarcadores?',
   'quiz',
   NULL,
   4, 60, 4);

UPDATE course_lessons SET quiz_data = jsonb_build_object(
  'questions', jsonb_build_array(
    jsonb_build_object(
      'id', 1,
      'question_pt', 'Qual é a faixa cardioprotetiva ideal do ômega 3 index?',
      'options_pt', jsonb_build_array('< 4%', '4-6%', '6-8%', '> 8%'),
      'correct_index', 3,
      'explanation_pt', 'Acima de 8% está associado a menor risco cardiovascular em populações como os japoneses.'
    ),
    jsonb_build_object(
      'id', 2,
      'question_pt', 'O que mede a razão AA/EPA?',
      'options_pt', jsonb_build_array(
        'Quantidade total de ômega 3 no plasma',
        'Equilíbrio entre ácido araquidônico (pró-inflamatório) e EPA (anti)',
        'Risco de diabetes tipo 2',
        'Nível de colesterol LDL'
      ),
      'correct_index', 1,
      'explanation_pt', 'AA/EPA é o melhor predador de inflamação celular. EPA compete com AA pelas mesmas enzimas.'
    ),
    jsonb_build_object(
      'id', 3,
      'question_pt', 'Quantos dias o ômega 3 leva para mudar a composição das membranas?',
      'options_pt', jsonb_build_array('7 dias', '30 dias', '90-120 dias', '1 ano'),
      'correct_index', 2,
      'explanation_pt', 'Hemácias vivem 120 dias. Por isso o protocolo OAM tem essa duração.'
    )
  )
) WHERE slug = 'quiz-biomarcadores';

-- Módulo: As 7 dimensões integradas (7 Saúdes Mind7) - adicionar lições além da reflexão
INSERT INTO course_lessons (module_id, course_id, slug, title_pt, title_en, title_es, lesson_type, content_pt, estimated_minutes, xp_reward, display_order) VALUES
  ('33333333-3333-3333-3333-333333333332',
   (SELECT id FROM courses WHERE slug = '7-saudes-mind7'),
   'saude-familiar',
   'Saúde Familiar: a fundação invisível',
   'Family Health: the invisible foundation',
   'Salud Familiar: la base invisible',
   'article',
   'Nenhum sucesso financeiro justifica o fracasso de uma família. Saúde Familiar é o que sustenta tudo. Família funcional não é família perfeita, é família que sabe se comunicar, que tem rituais sagrados, que prioriza presença. Roberti aprendeu que sua Ferrari pós-depressão não substituiu o jantar com Margarete e as filhas. Não é nostalgia: é o sistema operacional emocional.',
   8, 35, 4),

  ('33333333-3333-3333-3333-333333333332',
   (SELECT id FROM courses WHERE slug = '7-saudes-mind7'),
   'saude-espiritual',
   'Saúde Espiritual: a bússola interior',
   'Spiritual Health: the inner compass',
   'Salud Espiritual: la brújula interior',
   'article',
   'Cresça por fora sem se perder por dentro. Saúde Espiritual não é religião. É conexão com algo maior que você, é propósito, é fé. Para Roberti, é a base cristã. Para você, pode ser oração, meditação, leitura sagrada, comunhão com a natureza. O ponto é: gente que não cuida do invisível, cedo ou tarde, fragmenta no visível.',
   7, 35, 5),

  ('33333333-3333-3333-3333-333333333332',
   (SELECT id FROM courses WHERE slug = '7-saudes-mind7'),
   'saude-financeira',
   'Saúde Financeira: dinheiro como ferramenta',
   'Financial Health: money as a tool',
   'Salud Financiera: dinero como herramienta',
   'article',
   'Dinheiro é um ótimo servo, mas um péssimo senhor. Saúde Financeira não é sobre quanto você ganha, é sobre o controle. Pessoas que dominam dinheiro vivem em paz. Pessoas dominadas pelo dinheiro vivem em ansiedade. Reserva de emergência, sem dívidas tóxicas, investimentos consistentes. Tranquilidade financeira liberta o ser pra dedicar-se às outras 6 saúdes.',
   8, 35, 6),

  ('33333333-3333-3333-3333-333333333332',
   (SELECT id FROM courses WHERE slug = '7-saudes-mind7'),
   'saudes-intelectual-profissional-social',
   'Intelectual, Profissional, Social: as 3 saúdes operacionais',
   'Intellectual, Professional, Social: the 3 operational',
   'Intelectual, Profesional, Social: las 3 operacionales',
   'article',
   'Intelectual: ser é maior do que ter. Leitura, estudo, curiosidade. Mente que para de aprender envelhece. Profissional: alta performance exige clareza, metas e método. Trabalho como vocação, não só renda. Social: você é a média das 5 pessoas com quem mais convive. Cuide das suas tribos. Essas 3 são as operacionais, o dia a dia. As 4 anteriores (Familiar, Espiritual, Física, Financeira) são fundacionais. Treine as 7 e sua vida funciona.',
   10, 40, 7);

-- Atualizar progress total dos cursos (recalcula automaticamente em runtime via complete_lesson)
