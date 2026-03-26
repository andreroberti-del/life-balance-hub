import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { getServiceClient } from '../_shared/supabase-client.ts';

/**
 * Garmin Webhook Handler
 * Receives push notifications from Garmin Health API when new data is available.
 * Garmin sends data to a single webhook URL per application.
 * Each payload contains userAccessToken which we match to garmin_connections.access_token.
 */

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const supabase = getServiceClient();
  let payload: Record<string, unknown>;

  try {
    payload = await req.json();
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  // Log the webhook immediately
  const { data: logEntry } = await supabase.from('garmin_webhook_log').insert({
    event_type: Object.keys(payload).join(','),
    payload,
    processing_status: 'pending',
  }).select('id').single();

  const logId = logEntry?.id;

  try {
    // Process each data type
    if (payload.dailies) {
      await processDailies(supabase, payload.dailies as GarminWebhookItem[]);
    }
    if (payload.activities) {
      await processActivities(supabase, payload.activities as GarminWebhookItem[]);
    }
    if (payload.sleeps) {
      await processSleeps(supabase, payload.sleeps as GarminWebhookItem[]);
    }
    if (payload.bodyComps) {
      await processBodyComps(supabase, payload.bodyComps as GarminWebhookItem[]);
    }
    if (payload.stressDetails) {
      await processStress(supabase, payload.stressDetails as GarminWebhookItem[]);
    }

    // Mark as processed
    if (logId) {
      await supabase.from('garmin_webhook_log').update({
        processing_status: 'processed',
        processed_at: new Date().toISOString(),
      }).eq('id', logId);
    }

    return new Response('OK', { status: 200 });
  } catch (err) {
    console.error('Webhook processing error:', err);
    if (logId) {
      await supabase.from('garmin_webhook_log').update({
        processing_status: 'failed',
        error_message: String(err),
        processed_at: new Date().toISOString(),
      }).eq('id', logId);
    }
    return new Response('OK', { status: 200 }); // Return 200 to prevent Garmin retries
  }
});

interface GarminWebhookItem {
  userAccessToken: string;
  [key: string]: unknown;
}

async function resolveUserId(supabase: ReturnType<typeof getServiceClient>, accessToken: string): Promise<string | null> {
  const { data } = await supabase
    .from('garmin_connections')
    .select('user_id')
    .eq('access_token', accessToken)
    .eq('is_active', true)
    .single();
  return data?.user_id || null;
}

async function processDailies(supabase: ReturnType<typeof getServiceClient>, items: GarminWebhookItem[]) {
  for (const item of items) {
    const userId = await resolveUserId(supabase, item.userAccessToken);
    if (!userId) continue;

    await supabase.from('garmin_daily_summaries').upsert({
      user_id: userId,
      summary_date: item.calendarDate as string,
      steps: item.steps as number | null,
      distance_meters: item.distanceInMeters as number | null,
      active_calories: item.activeKilocalories as number | null,
      total_calories: item.totalKilocalories as number | null,
      resting_heart_rate: item.restingHeartRateInBeatsPerMinute as number | null,
      max_heart_rate: item.maxHeartRateInBeatsPerMinute as number | null,
      avg_stress_level: item.averageStressLevel as number | null,
      floors_climbed: item.floorsClimbed as number | null,
      intensity_minutes: item.intensityDurationInSeconds ? Math.floor((item.intensityDurationInSeconds as number) / 60) : null,
      moderate_intensity_minutes: item.moderateIntensityDurationInSeconds ? Math.floor((item.moderateIntensityDurationInSeconds as number) / 60) : null,
      vigorous_intensity_minutes: item.vigorousIntensityDurationInSeconds ? Math.floor((item.vigorousIntensityDurationInSeconds as number) / 60) : null,
      raw_json: item,
      synced_at: new Date().toISOString(),
    }, { onConflict: 'user_id,summary_date' });

    // Update last_sync_at on connection
    await supabase.from('garmin_connections').update({ last_sync_at: new Date().toISOString() }).eq('user_id', userId);
  }
}

async function processActivities(supabase: ReturnType<typeof getServiceClient>, items: GarminWebhookItem[]) {
  for (const item of items) {
    const userId = await resolveUserId(supabase, item.userAccessToken);
    if (!userId) continue;

    await supabase.from('garmin_activities').upsert({
      user_id: userId,
      garmin_activity_id: String(item.activityId || item.summaryId),
      activity_type: (item.activityType as string) || 'OTHER',
      activity_name: item.activityName as string | null,
      started_at: item.startTimeInSeconds
        ? new Date((item.startTimeInSeconds as number) * 1000).toISOString()
        : new Date().toISOString(),
      duration_seconds: item.durationInSeconds as number | null,
      distance_meters: item.distanceInMeters as number | null,
      active_calories: item.activeKilocalories as number | null,
      avg_heart_rate: item.averageHeartRateInBeatsPerMinute as number | null,
      max_heart_rate: item.maxHeartRateInBeatsPerMinute as number | null,
      avg_speed: item.averageSpeedInMetersPerSecond as number | null,
      elevation_gain: item.totalElevationGainInMeters as number | null,
      raw_json: item,
      synced_at: new Date().toISOString(),
    }, { onConflict: 'user_id,garmin_activity_id' });
  }
}

async function processSleeps(supabase: ReturnType<typeof getServiceClient>, items: GarminWebhookItem[]) {
  for (const item of items) {
    const userId = await resolveUserId(supabase, item.userAccessToken);
    if (!userId) continue;

    await supabase.from('garmin_sleep_summaries').upsert({
      user_id: userId,
      sleep_date: item.calendarDate as string,
      total_sleep_seconds: item.durationInSeconds as number | null,
      deep_sleep_seconds: item.deepSleepDurationInSeconds as number | null,
      light_sleep_seconds: item.lightSleepDurationInSeconds as number | null,
      rem_sleep_seconds: item.remSleepInSeconds as number | null,
      awake_seconds: item.awakeDurationInSeconds as number | null,
      sleep_score: item.overallSleepScore ? (item.overallSleepScore as { value?: number })?.value ?? null : null,
      sleep_start: item.startTimeInSeconds
        ? new Date((item.startTimeInSeconds as number) * 1000).toISOString()
        : null,
      sleep_end: item.startTimeInSeconds && item.durationInSeconds
        ? new Date(((item.startTimeInSeconds as number) + (item.durationInSeconds as number)) * 1000).toISOString()
        : null,
      avg_respiration: item.averageRespirationValue as number | null,
      avg_spo2: item.averageSPO2Value as number | null,
      avg_heart_rate: item.averageHeartRate as number | null,
      raw_json: item,
      synced_at: new Date().toISOString(),
    }, { onConflict: 'user_id,sleep_date' });
  }
}

async function processBodyComps(supabase: ReturnType<typeof getServiceClient>, items: GarminWebhookItem[]) {
  for (const item of items) {
    const userId = await resolveUserId(supabase, item.userAccessToken);
    if (!userId) continue;

    await supabase.from('garmin_body_compositions').insert({
      user_id: userId,
      measured_at: item.measurementTimeInSeconds
        ? new Date((item.measurementTimeInSeconds as number) * 1000).toISOString()
        : new Date().toISOString(),
      weight_grams: item.weightInGrams as number | null,
      bmi: item.bMI as number | null,
      body_fat_pct: item.bodyFatPercentage as number | null,
      muscle_mass_grams: item.muscleMassInGrams as number | null,
      bone_mass_grams: item.boneMassInGrams as number | null,
      body_water_pct: item.bodyWaterPercentage as number | null,
      raw_json: item,
      synced_at: new Date().toISOString(),
    });
  }
}

async function processStress(supabase: ReturnType<typeof getServiceClient>, items: GarminWebhookItem[]) {
  for (const item of items) {
    const userId = await resolveUserId(supabase, item.userAccessToken);
    if (!userId) continue;

    await supabase.from('garmin_stress_summaries').upsert({
      user_id: userId,
      stress_date: item.calendarDate as string,
      avg_stress: item.averageStressLevel as number | null,
      max_stress: item.maxStressLevel as number | null,
      stress_duration_seconds: item.stressDurationInSeconds as number | null,
      rest_duration_seconds: item.restStressDurationInSeconds as number | null,
      activity_duration_seconds: item.activityStressDurationInSeconds as number | null,
      low_stress_duration_seconds: item.lowStressDurationInSeconds as number | null,
      medium_stress_duration_seconds: item.mediumStressDurationInSeconds as number | null,
      high_stress_duration_seconds: item.highStressDurationInSeconds as number | null,
      raw_json: item,
      synced_at: new Date().toISOString(),
    }, { onConflict: 'user_id,stress_date' });
  }
}
