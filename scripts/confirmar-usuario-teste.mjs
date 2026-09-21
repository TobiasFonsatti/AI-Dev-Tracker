import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const email = process.argv[2];
if (!email) {
  console.error("Uso: node scripts/confirmar-usuario-teste.mjs <email>");
  process.exit(1);
}

const { data, error } = await supabase.auth.admin.listUsers();
if (error) throw error;

const user = data.users.find((u) => u.email === email);
if (!user) {
  console.error("Usuário não encontrado:", email);
  process.exit(1);
}

const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
  email_confirm: true,
});
if (updateError) throw updateError;

console.log("Usuário confirmado:", email);
