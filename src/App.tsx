import { useState } from "react";

type NavItem = {
  label: string;
  symbol: string;
  section: string;
};

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
  { label: "Vendas de hoje", value: "R$ 0,00", note: "Nenhuma venda registrada", symbol: "↗" },
  { label: "Pedidos", value: "0", note: "Neste período demonstrativo", symbol: "▣" },
  { label: "Produtos cadastrados", value: "0", note: "Catálogo ainda não configurado", symbol: "▦" },
  { label: "Estoque baixo", value: "0", note: "Alertas aparecerão aqui", symbol: "!" },
];

function App() {
  const [active, setActive] = useState("Visão geral");

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#inicio" aria-label="TH COMPANY ERP início">
          <span className="brand-mark">TH</span>
          <span className="brand-copy">
            <strong>TH COMPANY</strong>
            <small>ERP · GESTÃO INTELIGENTE</small>
          </span>
        </a>

        <div className="workspace">
          <span className="workspace-avatar">T</span>
          <span className="workspace-copy">
            <strong>Minha empresa</strong>
            <small>Ambiente demonstrativo</small>
          </span>
          <span className="chevron">⌄</span>
        </div>

        <nav className="navigation" aria-label="Menu principal">
          {["INÍCIO", "OPERAÇÃO", "GESTÃO"].map((section) => (
            <div className="nav-section" key={section}>
              <p className="nav-heading">{section}</p>
              {navigation.filter((item) => item.section === section).map((item) => (
                <button
                  className={active === item.label ? "nav-item active" : "nav-item"}
                  key={item.label}
                  onClick={() => setActive(item.label)}
                  type="button"
                >
                  <span className="nav-symbol">{item.symbol}</span>
                  <span>{item.label}</span>
                  {active === item.label && <span className="active-dot" />}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="plan-card">
            <span className="plan-icon">✦</span>
            <strong>Seu negócio, em controle.</strong>
            <p>Uma base simples para crescer com organização.</p>
          </div>
          <div className="profile">
            <span className="profile-avatar">TH</span>
            <span className="profile-copy">
              <strong>Administrador</strong>
              <small>Prévia local</small>
            </span>
            <span className="more">···</span>
          </div>
        </div>
      </aside>

      <main className="main-content" id="inicio">
        <header className="topbar">
          <div className="breadcrumb"><span>TH COMPANY ERP</span><span className="slash">/</span><strong>{active}</strong></div>
          <div className="topbar-actions">
            <span className="demo-pill"><span /> MODO DEMONSTRAÇÃO</span>
            <button className="icon-button" type="button" aria-label="Notificações">♧<i /></button>
            <span className="top-avatar">TH</span>
          </div>
        </header>

        <div className="page-content">
          <section className="welcome-row">
            <div>
              <p className="eyebrow">PAINEL DE CONTROLE</p>
              <h1>Bom dia, <span>TH COMPANY.</span></h1>
              <p className="subtitle">Aqui está um resumo da operação do seu negócio.</p>
            </div>
            <div className="date-chip"><span>◷</span> Visão geral · Hoje</div>
          </section>

          <section className="notice" aria-label="Aviso de demonstração">
            <span className="notice-icon">i</span>
            <p><strong>Estrutura inicial do ERP</strong><span>Esta é uma prévia visual. Os dados e módulos operacionais serão conectados nas próximas etapas.</span></p>
            <span className="notice-tag">FASE 1</span>
          </section>

          <section className="metrics-grid" aria-label="Indicadores demonstrativos">
            {metrics.map((metric, index) => (
              <article className="metric-card" key={metric.label}>
                <div className="metric-top">
                  <span className="metric-label">{metric.label}</span>
                  <span className={index === 3 ? "metric-icon warning" : "metric-icon"}>{metric.symbol}</span>
                </div>
                <strong className="metric-value">{metric.value}</strong>
                <span className="metric-note">{metric.note}</span>
              </article>
            ))}
          </section>

          <section className="content-grid">
            <article className="panel sales-panel">
              <div className="panel-header">
                <div><h2>Resumo de vendas</h2><p>Acompanhe o movimento do negócio</p></div>
                <span className="period-select">Últimos 7 dias <span>⌄</span></span>
              </div>
              <div className="chart-empty">
                <div className="chart-illustration"><span>↗</span></div>
                <strong>Seu desempenho começa aqui</strong>
                <p>Quando o módulo de vendas estiver conectado, seus resultados aparecerão neste gráfico.</p>
              </div>
              <div className="chart-footer"><span><i className="legend-dot" /> Vendas</span><span>Sem dados registrados</span></div>
            </article>

            <article className="panel quick-panel">
              <div className="panel-header">
                <div><h2>Acesso rápido</h2><p>Atalhos para a rotina</p></div>
                <span className="panel-more">···</span>
              </div>
              <div className="quick-list">
                <button type="button" onClick={() => setActive("Vendas")}><span className="quick-icon gold">↗</span><span><strong>Vendas</strong><small>Registrar e consultar vendas</small></span><b>→</b></button>
                <button type="button" onClick={() => setActive("Produtos")}><span className="quick-icon slate">▦</span><span><strong>Produtos</strong><small>Preparar o catálogo</small></span><b>→</b></button>
                <button type="button" onClick={() => setActive("Estoque")}><span className="quick-icon olive">▤</span><span><strong>Estoque</strong><small>Planejar movimentações</small></span><b>→</b></button>
                <button type="button" onClick={() => setActive("Caixa")}><span className="quick-icon bronze">＄</span><span><strong>Caixa</strong><small>Planejar abertura e fechamento</small></span><b>→</b></button>
              </div>
            </article>
          </section>

          <section className="panel activity-panel">
            <div className="panel-header">
              <div><h2>Atividade recente</h2><p>Movimentações da sua empresa</p></div>
              <span className="empty-label">AGUARDANDO CONFIGURAÇÃO</span>
            </div>
            <div className="activity-empty"><span className="activity-symbol">◷</span><span>Nenhuma atividade por enquanto.</span><small>As movimentações aparecerão aqui quando os módulos forem implementados.</small></div>
          </section>

          <footer className="footer"><span>© 2026 TH COMPANY · ERP</span><span><i /> Estrutura inicial · Fase 1</span></footer>
        </div>
      </main>
    </div>
  );
}

export default App;
