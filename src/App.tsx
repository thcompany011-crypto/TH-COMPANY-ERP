import { useEffect, useState, type FormEvent } from "react";
import type { Session } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabase } from "./lib/supabase";
import "./auth.css";

type AuthMode = "login" | "signup" | "reset" | "update" | "updated";
type NavItem = { label: string; symbol: string; section: string };

const navigation: NavItem[] = [
  { label: "Visão geral", symbol: "⌂", section: "INÍCIO" },
  { label: "Vendas", symbol: "↗", section: "OPERAÇÃO" },
  { label: "Produtos", symbol: "▦", section: "OPERAÇÃO" },
  { label: "Estoque", symbol: "▤", section: "OPERAÇÃO" },
  { label: "Caixa", symbol: "＄", section: "OPERAÇÃO" },
  { label: "Financeiro", symbol: "◷", section: "GESTÃO" },
  { label: "Relatórios", symbol: "▥", section: "GESTÃO" },
];

const metrics = [
  { label: "Vendas de hoje", value: "R$ 0,00", note: "Módulo ainda não conectado", symbol: "↗" },
  { label: "Pedidos", value: "0", note: "Sem dados operacionais", symbol: "▣" },
  { label: "Produtos cadastrados", value: "0", note: "Catálogo ainda não conectado", symbol: "▦" },
  { label: "Estoque baixo", value: "0", note: "Alertas serão implementados", symbol: "!" },
];

function AuthScreen({ initialMode = "login", onRecoveryComplete }: { initialMode?: AuthMode; onRecoveryComplete?: () => void }) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const changeMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setMessage("");
    setIsError(false);
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsError(false);
    if (!supabase) return;
    setBusy(true);

    try {
      if (mode === "signup") {
        if (fullName.trim().length < 2 || companyName.trim().length < 2) {
          throw new Error("Informe seu nome e o nome da empresa.");
        }
        if (password.length < 8) {
          throw new Error("A senha deve ter pelo menos 8 caracteres.");
        }
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { data: { full_name: fullName.trim(), company_name: companyName.trim() } },
        });
        if (error) throw error;
        setMessage(data.session
          ? "Conta criada. Sua empresa foi registrada; você já pode acessar o painel."
          : "Cadastro recebido! Confira seu e-mail para confirmar a conta. A empresa será criada automaticamente e você poderá entrar após confirmar.");
        setMode("login");
        setPassword("");
      } else if (mode === "update") {
        if (password.length < 8) throw new Error("A nova senha deve ter pelo menos 8 caracteres.");
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
        setMessage("Senha atualizada com sucesso. Continue para acessar o ERP.");
        setMode("updated");
      } else if (mode === "reset") {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: window.location.origin,
        });
        if (error) throw error;
        setMessage("Se esse e-mail estiver cadastrado, você receberá instruções para redefinir a senha.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
      }
    } catch (error) {
      setIsError(true);
      setMessage(error instanceof Error ? error.message : "Não foi possível concluir a solicitação.");
    } finally {
      setBusy(false);
    }
  }

  const title = mode === "signup" ? "Crie sua empresa" : mode === "reset" ? "Recuperar acesso" : mode === "update" ? "Defina uma nova senha" : mode === "updated" ? "Senha atualizada" : "Entre na sua conta";
  const description = mode === "signup"
    ? "Comece seu espaço de gestão. A conta que cria a empresa recebe o perfil de proprietário."
    : mode === "reset"
      ? "Informe o e-mail da conta para receber as instruções de redefinição."
      : mode === "update" || mode === "updated"
        ? "Escolha uma senha forte com pelo menos 8 caracteres."
        : "Acesse o ambiente seguro da sua empresa.";

  return (
    <main className="auth-screen">
      <section className="auth-card" aria-labelledby="auth-title">
        <div className="auth-brand">
          <span className="auth-brand-mark">TH</span>
          <span><strong>TH COMPANY</strong><small>ERP · GESTÃO INTELIGENTE</small></span>
        </div>
        <h1 id="auth-title">{title}</h1>
        <p className="auth-description">{description}</p>
        {message && <p className={isError ? "auth-message error" : "auth-message"} role="status">{message}</p>}
        {mode === "updated" ? <button className="auth-submit" type="button" onClick={onRecoveryComplete}>Continuar para o ERP</button> : <form className="auth-form" onSubmit={handleSubmit}>
          {mode === "signup" && <>
            <label className="auth-field">Seu nome
              <input autoComplete="name" value={fullName} onChange={(event) => setFullName(event.target.value)} required minLength={2} placeholder="Nome do responsável" />
            </label>
            <label className="auth-field">Nome da empresa
              <input autoComplete="organization" value={companyName} onChange={(event) => setCompanyName(event.target.value)} required minLength={2} placeholder="Ex.: Golds Beer" />
            </label>
          </>}
          {mode !== "update" && <label className="auth-field">E-mail
            <input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required placeholder="voce@empresa.com.br" />
          </label>}
          {mode !== "reset" && mode !== "updated" && <label className="auth-field">{mode === "update" ? "Nova senha" : "Senha"}
            <input type="password" autoComplete={mode === "signup" || mode === "update" ? "new-password" : "current-password"} value={password} onChange={(event) => setPassword(event.target.value)} required minLength={mode === "signup" ? 8 : 1} placeholder={mode === "signup" ? "Mínimo de 8 caracteres" : "Sua senha"} />
          </label>}
          <button className="auth-submit" type="submit" disabled={busy}>
            {busy ? "Aguarde..." : mode === "signup" ? "Criar empresa e conta" : mode === "reset" ? "Enviar instruções" : mode === "update" ? "Salvar nova senha" : "Entrar com segurança"}
          </button>
        </form>}
        <div className="auth-links">
          {mode !== "login" && <button className="auth-link" type="button" onClick={() => changeMode("login")}>Voltar para o login</button>}
          {mode === "login" && <>
            <button className="auth-link" type="button" onClick={() => changeMode("reset")}>Esqueci minha senha</button>
            <button className="auth-link" type="button" onClick={() => changeMode("signup")}>Criar uma empresa</button>
          </>}
        </div>
        <p className="auth-footnote">Seus dados empresariais devem ficar separados por empresa. Os módulos de vendas, estoque e financeiro ainda estão em desenvolvimento.</p>
      </section>
    </main>
  );
}

function Dashboard({ session, companyName, role }: { session: Session; companyName: string; role: string }) {
  const [active, setActive] = useState("Visão geral");
  const [signingOut, setSigningOut] = useState(false);

  async function signOut() {
    if (!supabase) return;
    setSigningOut(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      window.alert("Não foi possível sair da conta. Tente novamente.");
      setSigningOut(false);
    }
  }

  return (
    <div className="app-shell">
      <div className="account-bar dashboard-account">
        <span className="account-company">{companyName || "Empresa sem vínculo"}</span>
        <span className="account-user">{session.user.email} · {role || "membro"}</span>
        <button className="signout-button" type="button" onClick={signOut} disabled={signingOut}>{signingOut ? "Saindo..." : "Sair da conta"}</button>
      </div>
      <aside className="sidebar">
        <a className="brand" href="#inicio" aria-label="TH COMPANY ERP início">
          <span className="brand-mark">TH</span>
          <span className="brand-copy"><strong>TH COMPANY</strong><small>ERP · GESTÃO INTELIGENTE</small></span>
        </a>
        <div className="workspace">
          <span className="workspace-avatar">{(companyName || "T").slice(0, 1).toUpperCase()}</span>
          <span className="workspace-copy"><strong>{companyName || "Empresa"}</strong><small>Ambiente autenticado</small></span>
          <span className="chevron">⌄</span>
        </div>
        <nav className="navigation" aria-label="Menu principal">
          {["INÍCIO", "OPERAÇÃO", "GESTÃO"].map((section) => (
            <div className="nav-section" key={section}>
              <p className="nav-heading">{section}</p>
              {navigation.filter((item) => item.section === section).map((item) => (
                <button className={active === item.label ? "nav-item active" : "nav-item"} key={item.label} onClick={() => setActive(item.label)} type="button">
                  <span className="nav-symbol">{item.symbol}</span><span>{item.label}</span>{active === item.label && <span className="active-dot" />}
                </button>
              ))}
            </div>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="plan-card"><span className="plan-icon">✦</span><strong>Seu negócio, em controle.</strong><p>Uma base simples para crescer com organização.</p></div>
          <div className="profile"><span className="profile-avatar">TH</span><span className="profile-copy"><strong>{session.user.email}</strong><small>{role || "Membro da empresa"}</small></span></div>
        </div>
      </aside>
      <main className="main-content" id="inicio">
        <header className="topbar">
          <div className="breadcrumb"><span>TH COMPANY ERP</span><span className="slash">/</span><strong>{active}</strong></div>
          <div className="topbar-actions"><span className="demo-pill"><span /> MÓDULOS DEMONSTRATIVOS</span><span className="top-avatar">TH</span></div>
        </header>
        <div className="page-content">
          <section className="welcome-row">
            <div><p className="eyebrow">PAINEL DE CONTROLE</p><h1>Bem-vindo, <span>{companyName || "sua empresa"}.</span></h1><p className="subtitle">Sua sessão está autenticada. Os módulos operacionais serão implementados por etapas.</p></div>
            <div className="date-chip"><span>◷</span> Visão geral · Hoje</div>
          </section>
          <section className="notice" aria-label="Aviso de demonstração">
            <span className="notice-icon">i</span><p><strong>Etapa 2 — autenticação e empresas</strong><span>O login e a base de empresas estão preparados. Vendas, estoque, caixa e indicadores continuam demonstrativos, sem dados reais.</span></p><span className="notice-tag">FASE 2</span>
          </section>
          <section className="metrics-grid" aria-label="Indicadores demonstrativos">
            {metrics.map((metric, index) => <article className="metric-card" key={metric.label}><div className="metric-top"><span className="metric-label">{metric.label}</span><span className={index === 3 ? "metric-icon warning" : "metric-icon"}>{metric.symbol}</span></div><strong className="metric-value">{metric.value}</strong><span className="metric-note">{metric.note}</span></article>)}
          </section>
          <section className="content-grid">
            <article className="panel sales-panel"><div className="panel-header"><div><h2>Resumo de vendas</h2><p>Acompanhe o movimento do negócio</p></div><span className="period-select">Últimos 7 dias <span>⌄</span></span></div><div className="chart-empty"><div className="chart-illustration"><span>↗</span></div><strong>Seu desempenho começa aqui</strong><p>Quando o módulo de vendas estiver conectado, seus resultados aparecerão neste gráfico.</p></div><div className="chart-footer"><span><i className="legend-dot" /> Vendas</span><span>Sem dados registrados</span></div></article>
            <article className="panel quick-panel"><div className="panel-header"><div><h2>Acesso rápido</h2><p>Atalhos para a rotina</p></div><span className="panel-more">···</span></div><div className="quick-list">
              <button type="button" onClick={() => setActive("Vendas")}><span className="quick-icon gold">↗</span><span><strong>Vendas</strong><small>Registrar e consultar vendas</small></span><b>→</b></button>
              <button type="button" onClick={() => setActive("Produtos")}><span className="quick-icon slate">▦</span><span><strong>Produtos</strong><small>Preparar o catálogo</small></span><b>→</b></button>
              <button type="button" onClick={() => setActive("Estoque")}><span className="quick-icon olive">▤</span><span><strong>Estoque</strong><small>Planejar movimentações</small></span><b>→</b></button>
              <button type="button" onClick={() => setActive("Caixa")}><span className="quick-icon bronze">＄</span><span><strong>Caixa</strong><small>Planejar abertura e fechamento</small></span><b>→</b></button>
            </div></article>
          </section>
          <section className="panel activity-panel"><div className="panel-header"><div><h2>Atividade recente</h2><p>Movimentações da sua empresa</p></div><span className="empty-label">AGUARDANDO MÓDULOS</span></div><div className="activity-empty"><span className="activity-symbol">◷</span><span>Nenhuma atividade por enquanto.</span><small>As movimentações aparecerão aqui quando os módulos forem implementados.</small></div></section>
          <footer className="footer"><span>© 2026 TH COMPANY · ERP</span><span><i /> Sessão autenticada · Fase 2</span></footer>
        </div>
      </main>
    </div>
  );
}

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [workspaceError, setWorkspaceError] = useState("");
  const [recoveryMode, setRecoveryMode] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    let mounted = true;

    async function loadWorkspace(userId: string) {
      const { data, error } = await supabase!
        .from("company_memberships")
        .select("role, companies!inner(name)")
        .eq("user_id", userId)
        .limit(1)
        .maybeSingle();
      if (!mounted) return;
      if (error) {
        setWorkspaceError("Não foi possível carregar os dados da empresa. Confira se a migração SQL da etapa 2 foi aplicada.");
        setCompanyName("");
        setRole("");
        return;
      }
      const linkedCompany = (data as { role?: string; companies?: { name?: string } | { name?: string }[] } | null)?.companies;
      const company = Array.isArray(linkedCompany) ? linkedCompany[0] : linkedCompany;
      setCompanyName(company?.name || "");
      setRole((data as { role?: string } | null)?.role || "");
      setWorkspaceError(company ? "" : "Esta conta não possui uma empresa vinculada. Confirme que o cadastro foi concluído após aplicar a migração SQL.");
    }

    void supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      if (data.session) void loadWorkspace(data.session.user.id);
      else setLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (!mounted) return;
      if (event === "PASSWORD_RECOVERY") setRecoveryMode(true);
      setSession(nextSession);
      setWorkspaceError("");
      if (nextSession) {
        setLoading(true);
        void loadWorkspace(nextSession.user.id).finally(() => { if (mounted) setLoading(false); });
      } else {
        setCompanyName("");
        setRole("");
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (!isSupabaseConfigured || !supabase) {
    return <main className="setup-screen"><section className="setup-card"><h1>Configure o acesso ao TH COMPANY ERP</h1><p>O cliente Supabase já está preparado no código, mas o projeto ainda precisa ser conectado. Nenhuma credencial foi incluída no GitHub.</p><ol><li>Crie um projeto no Supabase.</li><li>Em <strong>Project Settings → API</strong>, copie a Project URL e a chave pública/anon.</li><li>Crie um arquivo local chamado <code>.env</code> usando <code>.env.example</code> como referência.</li><li>Execute <code>supabase/migrations/001_auth_multitenancy.sql</code> no SQL Editor do Supabase.</li><li>Reinicie o servidor com <code>npm run dev</code>.</li></ol><p>Depois disso, o cadastro, login e recuperação de senha poderão usar o serviço de autenticação.</p></section></main>;
  }

  if (loading) return <main className="setup-screen"><section className="setup-card"><h1>Carregando sua sessão…</h1><p>Verificando autenticação e vínculo da empresa.</p></section></main>;
  if (recoveryMode) return <AuthScreen initialMode="update" onRecoveryComplete={() => setRecoveryMode(false)} />;
  if (!session) return <AuthScreen />;
  return <><Dashboard session={session} companyName={companyName} role={role} />{workspaceError && <div className="auth-message error" style={{ position: "fixed", bottom: 16, right: 16, maxWidth: 420, zIndex: 10 }}>{workspaceError}</div>}</>;
}

export default App;
