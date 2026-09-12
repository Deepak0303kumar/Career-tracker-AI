const SUPABASE_URL = "https://mkhegaeevzopltoqovcb.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1raGVnYWVldnpvcGx0b3FvdmNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3NzM4MzUsImV4cCI6MjA5NjM0OTgzNX0.pX-Ih3lXa0L4i4vK8UCRQPZ7gYlaCVnxyOEDEiGou7k";

window.supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

window.isAllowedUser = (user) => {
  const email = user?.email?.trim().toLowerCase();
  return Boolean(email);
};