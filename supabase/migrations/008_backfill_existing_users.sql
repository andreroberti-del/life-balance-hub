-- M7 Life Balance: Backfill para usuários existentes
-- Triggers das migrations 004 e 005 só disparam em INSERT novo,
-- então usuários que já existiam ficaram sem user_levels nem referral_codes

INSERT INTO user_levels (user_id)
SELECT id FROM profiles
WHERE id NOT IN (SELECT user_id FROM user_levels)
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO referral_codes (user_id, code)
SELECT id, generate_referral_code() FROM profiles
WHERE id NOT IN (SELECT user_id FROM referral_codes)
ON CONFLICT (user_id) DO NOTHING;
