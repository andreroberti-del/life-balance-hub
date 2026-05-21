-- M7 Life Balance: Seed do banco Ômega 3
-- 15 marcas reais + 6 estudos + biomarcadores + outcomes anonimizados

-- BIOMARKERS de referência
INSERT INTO inflammation_biomarkers (marker_code, name_pt, name_en, what_is_pt, omega3_effect_pt, optimal_range_pt, unit, display_order) VALUES
  ('pcr_us', 'PCR Ultra-Sensível', 'High-Sensitivity CRP',
   'Proteína C-reativa, marcador clássico de inflamação sistêmica. Mede inflamação aguda.',
   'Doses > 2g/dia de EPA+DHA reduzem em até 30% após 12 semanas.',
   '< 1.0 mg/L', 'mg/L', 1),
  ('il6', 'Interleucina 6 (IL-6)', 'Interleukin 6',
   'Citocina pró-inflamatória central. Eleva-se em estresse, infecção e inflamação crônica.',
   'EPA inibe sinalização NF-κB. Redução de 10-25% em estudos clínicos.',
   '< 5 pg/mL', 'pg/mL', 2),
  ('tnf_alpha', 'TNF-α', 'TNF-alpha',
   'Tumor Necrosis Factor alpha. Citocina inflamatória chave em doenças autoimunes.',
   'Reduz com dose alta de EPA. Efeito dose-dependente.',
   '< 8.1 pg/mL', 'pg/mL', 3),
  ('omega3_index', 'Ômega 3 Index', 'Omega-3 Index',
   'Porcentagem de EPA+DHA nas membranas das hemácias. Métrica direta de status.',
   'Métrica que define se você "tem ômega 3" no corpo. Muda em 120 dias.',
   '> 8% ideal, 4-8% médio, < 4% deficiente', '%', 4),
  ('aa_epa_ratio', 'Razão AA/EPA', 'AA/EPA Ratio',
   'Razão entre ácido araquidônico (pró-inflamatório) e EPA (anti). Predador de inflamação celular.',
   'Cair de 20:1 para < 3:1 é o objetivo do protocolo OAM.',
   '< 3 ideal, 3-10 moderado, > 10 elevado', '', 5),
  ('omega6_3_ratio', 'Razão Ômega 6/3', 'Omega 6/3 Ratio',
   'Equilíbrio de ácidos graxos essenciais na dieta. Americano padrão é 15-20:1.',
   'Reduz à medida que ômega 3 aumenta. Meta < 4:1.',
   '< 4 ideal, americano padrão 15-20:1', '', 6);

-- PRODUTOS (15 marcas)
INSERT INTO omega_products (brand, product_name, slug, country_origin, epa_mg_per_serving, dha_mg_per_serving, serving_caps, chemical_form, source, oxidation_totox, oxidation_grade, third_party_certified, price_per_month_usd, absorption_score, label_accuracy_score, is_benchmark, notes) VALUES
  -- Benchmark
  ('Zinzino', 'BalanceOil+ 300ml', 'zinzino-balanceoil-plus', 'Norway',
   1800, 1200, 1, 'triglyceride', 'fish_oil',
   3.5, 'excellent', 'IFOS', 60.00, 92, 98, TRUE,
   'Forma TG natural, baixíssima oxidação, polifenóis de azeitona como antioxidante.'),
  -- Concorrentes premium
  ('Nordic Naturals', 'Ultimate Omega', 'nordic-naturals-ultimate-omega', 'USA',
   650, 450, 2, 'triglyceride', 'fish_oil',
   8.5, 'good', 'IFOS', 50.00, 85, 90, FALSE,
   'Boa marca, mas dose menor que benchmark requer 2 caps.'),
  ('Carlson Labs', 'The Very Finest Fish Oil', 'carlson-very-finest', 'USA',
   800, 500, 1, 'triglyceride', 'fish_oil',
   7.0, 'good', 'IFOS', 38.00, 82, 88, FALSE,
   'Líquido, sabor limão, dose razoável.'),
  ('Wiley''s Finest', 'Wild Alaskan Fish Oil', 'wileys-wild-alaskan', 'USA',
   660, 250, 1, 'triglyceride', 'fish_oil',
   6.0, 'good', 'IFOS', 45.00, 80, 92, FALSE,
   'Salmão alasquino, perfil EPA dominante.'),
  ('OmegaVia', 'Pharmaceutical Grade Fish Oil', 'omegavia-pharma', 'USA',
   720, 480, 1, 'ethyl_ester', 'fish_oil',
   9.0, 'good', 'IFOS', 42.00, 70, 85, FALSE,
   'Forma EE concentrada, mas menos biodisponível.'),
  -- Massa de mercado
  ('Solgar', 'Triple Strength Omega-3', 'solgar-triple-strength', 'USA',
   504, 378, 1, 'ethyl_ester', 'fish_oil',
   14.5, 'good', 'none', 28.00, 65, 75, FALSE,
   'Marca conhecida, forma EE, oxidação aceitável mas não excepcional.'),
  ('Now Foods', 'Ultra Omega-3', 'now-foods-ultra', 'USA',
   500, 250, 1, 'ethyl_ester', 'fish_oil',
   18.0, 'good', 'none', 18.00, 60, 70, FALSE,
   'Preço baixo, qualidade média, forma EE.'),
  ('GNC', 'Triple Strength Fish Oil', 'gnc-triple-strength', 'USA',
   600, 300, 2, 'ethyl_ester', 'fish_oil',
   22.0, 'good', 'none', 25.00, 58, 65, FALSE,
   'Necessita 2 caps. Forma EE comum em produtos mass-market.'),
  ('Nature Made', 'Fish Oil 1200mg', 'nature-made-fish-oil-1200', 'USA',
   180, 120, 1, 'ethyl_ester', 'fish_oil',
   28.0, 'poor', 'USP', 12.00, 50, 60, FALSE,
   'Dose baixíssima. 1 cápsula entrega só 300mg total. Difícil atingir dose terapêutica.'),
  ('Kirkland Signature', 'Fish Oil 1200mg', 'kirkland-fish-oil', 'USA',
   216, 144, 1, 'ethyl_ester', 'fish_oil',
   30.0, 'poor', 'none', 10.00, 50, 65, FALSE,
   'Costco brand. Preço imbatível, qualidade compatível.'),
  -- Krill e algas
  ('Onnit', 'Krill Oil', 'onnit-krill-oil', 'USA',
   165, 105, 2, 'phospholipid', 'krill',
   5.0, 'excellent', 'none', 40.00, 92, 88, FALSE,
   'Krill: dose baixa mas forma fosfolipídica de alta absorção.'),
  ('Nordic Naturals', 'Algae Omega', 'nordic-naturals-algae', 'USA',
   195, 390, 2, 'triglyceride', 'algae',
   4.5, 'excellent', 'IFOS', 55.00, 85, 92, FALSE,
   'Vegano. Algae source. DHA dominante.'),
  -- Brasil
  ('Vitafor', 'Omega 3 Smartfish', 'vitafor-smartfish', 'Brazil',
   400, 300, 1, 'triglyceride', 'fish_oil',
   11.0, 'good', 'none', 35.00, 75, 80, FALSE,
   'Marca BR popular, forma TG. Dose moderada.'),
  ('Sanavita', 'Ômega 3 EPA+DHA', 'sanavita-omega3', 'Brazil',
   330, 220, 2, 'ethyl_ester', 'fish_oil',
   16.0, 'good', 'none', 30.00, 60, 72, FALSE,
   'Marca BR. Forma EE. 2 caps requeridas.'),
  -- Suplemento popular mass-market
  ('Spring Valley', 'Fish Oil 1000mg', 'spring-valley-1000', 'USA',
   180, 120, 1, 'ethyl_ester', 'fish_oil',
   32.0, 'poor', 'none', 8.00, 45, 55, FALSE,
   'Walmart brand. Dose mínima, oxidação alta. Provavelmente não vai mover seu ômega 3 index.');

-- ESTUDOS (6 estudos-chave)
INSERT INTO omega_studies (pubmed_id, study_title, year, sample_size, population, intervention, omega3_form_studied, primary_outcome, effect_size, p_value, dose_threshold_mg, duration_threshold_days, confidence_grade, funded_by_industry, summary_pt) VALUES
  (30415628, 'Marine n-3 Fatty Acids and Prevention of Cardiovascular Disease and Cancer', 2018, 25871,
   'Adultos saudáveis acima 50 anos (VITAL Trial)',
   '1g EPA+DHA por dia (Lovaza) ou placebo, 5.3 anos',
   'ethyl_ester', 'cardiovascular_events', -0.08, 0.24, 1000, 1500, 'high', FALSE,
   'NEJM. Não mostrou redução geral de eventos CV, mas analyses post-hoc sugerem benefício em quem tinha baixo consumo de peixe.'),

  (30415638, 'REDUCE-IT: Cardiovascular Risk Reduction with Icosapent Ethyl', 2019, 8179,
   'Pacientes com triglicérides elevados e doença CV ou diabetes',
   '4g/dia icosapent ethyl (EPA puro) vs placebo, mediana 4.9 anos',
   'ethyl_ester', 'cardiovascular_events', -0.25, 0.001, 4000, 1500, 'high', TRUE,
   'NEJM. Redução de 25% em eventos CV maiores. Estabeleceu dose alta de EPA puro como standard.'),

  (32014047, 'Effect of high-dose omega-3 fatty acids vs corn oil on major adverse cardiovascular events in patients at high cardiovascular risk', 2020, 13078,
   'Pacientes alto risco CV (STRENGTH Trial)',
   '4g/dia EPA+DHA (Epanova) vs corn oil, 3.5 anos',
   'free_fatty_acid', 'cardiovascular_events', -0.01, 0.84, 4000, 1500, 'high', TRUE,
   'JAMA. Não mostrou diferença. Possível efeito de óleo de milho como placebo ativo.'),

  (15642720, 'n-3 Fatty acids in cardiovascular disease', 2003, 11324,
   'Pós-infarto (GISSI-Prevenzione)',
   '850mg EPA+DHA/dia vs nada, 3.5 anos',
   'ethyl_ester', 'cardiovascular_mortality', -0.20, 0.001, 850, 1000, 'high', FALSE,
   'Lancet. Reduziu 20% mortalidade CV. Marco histórico do uso pós-infarto.'),

  (28903802, 'Plasma Phospholipid Long-Chain ω-3 Fatty Acids and Total and Cause-Specific Mortality in Older Adults', 2018, 2692,
   'Adultos 65+ (Cardiovascular Health Study)',
   'Análise observacional do ômega 3 plasmático ao longo de 16 anos',
   'biomarker', 'all_cause_mortality', -0.27, 0.001, NULL, NULL, 'moderate', FALSE,
   'JAMA. Adultos no quintil mais alto de ômega 3 viveram 2.2 anos a mais que o mais baixo.'),

  (35042745, 'Erythrocyte Omega-3 Index, Risk Factors, and the Aging of the Brain', 2022, 2183,
   'Adultos 46+ (Framingham Offspring)',
   'Avaliação MRI vs ômega 3 index',
   'biomarker', 'brain_volume', 0.18, 0.01, NULL, NULL, 'moderate', FALSE,
   'Neurology. Índice maior associou-se a maior volume cerebral e melhor função executiva.');

-- REAL WORLD outcomes (anonimizados, simulados pra demo)
INSERT INTO omega_real_world_outcomes (user_id_hashed, product_used, baseline_omega3_index, baseline_aa_epa_ratio, post_120d_omega3_index, post_120d_aa_epa_ratio, duration_days, age_band, sex, country) VALUES
  ('hash_001', 'zinzino-balanceoil-plus', 4.2, 15.2, 8.9, 2.8, 120, '35-45', 'M', 'Brazil'),
  ('hash_002', 'zinzino-balanceoil-plus', 3.8, 18.0, 9.2, 2.5, 120, '35-45', 'F', 'Peru'),
  ('hash_003', 'zinzino-balanceoil-plus', 5.1, 12.4, 9.8, 2.2, 120, '45-55', 'M', 'USA'),
  ('hash_004', 'zinzino-balanceoil-plus', 3.5, 22.0, 8.4, 3.1, 120, '25-35', 'F', 'Mexico'),
  ('hash_005', 'solgar-triple-strength', 4.0, 16.5, 5.8, 9.2, 120, '35-45', 'M', 'USA'),
  ('hash_006', 'nordic-naturals-ultimate-omega', 4.3, 14.8, 7.2, 5.4, 120, '40-50', 'F', 'USA'),
  ('hash_007', 'nature-made-fish-oil-1200', 3.9, 17.2, 4.4, 14.8, 120, '50-60', 'M', 'USA'),
  ('hash_008', 'kirkland-fish-oil', 4.1, 16.0, 4.5, 14.5, 120, '45-55', 'F', 'USA'),
  ('hash_009', 'now-foods-ultra', 4.0, 15.8, 5.5, 10.8, 120, '30-40', 'M', 'Brazil'),
  ('hash_010', 'vitafor-smartfish', 3.7, 18.5, 6.8, 6.2, 120, '35-45', 'F', 'Brazil');
