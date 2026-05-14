import { createClient } from "@/lib/supabase/server";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const admin = createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: projetosData } = await admin
    .from("projetos")
    .select("*")
    .order("atualizado_em", { ascending: false });

  if (!projetosData) return Response.json({ projetos: [] });

  const { data: usersData } = await admin.auth.admin.listUsers();
  const usersMap = new Map(usersData?.users.map((u) => [u.id, u]));

  const projetos = projetosData.map((row) => {
    const u = usersMap.get(row.user_id);
    return {
      id: row.id,
      titulo: row.titulo,
      tipologia: row.tipologia,
      status: row.status,
      criadoEm: row.criado_em,
      atualizadoEm: row.atualizado_em,
      clienteNome: u?.user_metadata?.nome ?? u?.email?.split("@")[0] ?? "Desconhecido",
      clienteEmail: u?.email ?? "",
      ...row.dados,
    };
  });

  return Response.json({ projetos });
}
