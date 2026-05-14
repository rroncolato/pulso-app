import { createClient } from "@/lib/supabase/server";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const admin = createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: row } = await admin
    .from("projetos")
    .select("*")
    .eq("id", id)
    .single();

  if (!row) return Response.json({ error: "Not found" }, { status: 404 });

  const { data: userData } = await admin.auth.admin.getUserById(row.user_id);

  const projeto = {
    id: row.id,
    titulo: row.titulo,
    tipologia: row.tipologia,
    status: row.status,
    criadoEm: row.criado_em,
    atualizadoEm: row.atualizado_em,
    clienteNome: userData?.user?.user_metadata?.nome ?? userData?.user?.email?.split("@")[0] ?? "Cliente",
    clienteEmail: userData?.user?.email ?? "",
    ...row.dados,
  };

  return Response.json({ projeto });
}
