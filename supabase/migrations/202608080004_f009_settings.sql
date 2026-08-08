update public.user_preferences
set notification_preferences = jsonb_build_object(
  'water_reminders',
  case when jsonb_typeof(notification_preferences -> 'water_reminders') = 'boolean'
    then notification_preferences -> 'water_reminders' else 'false'::jsonb end,
  'daily_reminders',
  case when jsonb_typeof(notification_preferences -> 'daily_reminders') = 'boolean'
    then notification_preferences -> 'daily_reminders' else 'false'::jsonb end,
  'goal_completion_notifications',
  case when jsonb_typeof(notification_preferences -> 'goal_completion_notifications') = 'boolean'
    then notification_preferences -> 'goal_completion_notifications' else 'false'::jsonb end
);

alter table public.user_preferences
  alter column notification_preferences set default
    '{"water_reminders": false, "daily_reminders": false, "goal_completion_notifications": false}'::jsonb,
  add constraint user_preferences_notifications_shape_check
    check (
      notification_preferences = jsonb_build_object(
        'water_reminders', notification_preferences -> 'water_reminders',
        'daily_reminders', notification_preferences -> 'daily_reminders',
        'goal_completion_notifications', notification_preferences -> 'goal_completion_notifications'
      )
      and jsonb_typeof(notification_preferences -> 'water_reminders') = 'boolean'
      and jsonb_typeof(notification_preferences -> 'daily_reminders') = 'boolean'
      and jsonb_typeof(notification_preferences -> 'goal_completion_notifications') = 'boolean'
    );

grant update (weight_unit, height_unit, language, theme, notification_preferences)
on table public.user_preferences to authenticated;

comment on table public.user_preferences is
  'User-owned MVP application preferences managed by F009 Settings.';
