import React, { useState } from 'react';

function Badge({ texto, tipo }) {
  const colores = {
    ok: { background: '#E8F5E9', color: '#1E7C3A' },
    warn: { background: '#FFF8E1', color: '#9A7209' },
    error: { background: '#FFEBEE', color: '#C62828' },
    info: { background: '#E3F2FD', color: '#1565C0' }
  };
  return (
    <span style={{
      ...colores[tipo],
      padding: '3px 10px',
      borderRadius: '20px',
      fontSize: '0.8rem',
      fontWeight: 600
    }}>{texto}</span>
  );
}

function SeccionColapsable({ titulo, children, defaultAbierto = false }) {
  const [abierto, setAbierto] = useState(defaultAbierto);
  return (
    <div className="card" style={{ marginBottom: '1.5rem' }}>
      <div
        onClick={() => setAbierto(!abierto)}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          paddingBottom: abierto ? '0.75rem' : 0,
          borderBottom: abierto ? '2px solid #F0B429' : 'none',
          marginBottom: abierto ? '1rem' : 0
        }}
      >
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#9A7209', margin: 0 }}>
          {titulo}
        </h3>
        <span style={{ fontSize: '1.1rem', color: '#9A7209', fontWeight: 700 }}>
          {abierto ? '▲' : '▼'}
        </span>
      </div>
      {abierto && children}
    </div>
  );
}

function SeccionTitle({ children }) {
  return (
    <h3 style={{
      fontSize: '1rem',
      fontWeight: 700,
      color: '#9A7209',
      marginBottom: '1rem',
      paddingBottom: '0.5rem',
      borderBottom: '2px solid #F0B429'
    }}>{children}</h3>
  );
}

export default function Informe({ informe, onNuevaEstimacion, reportUrl }) {
  const [descargando, setDescargando] = useState(false);
  const [errorPdf, setErrorPdf] = useState('');
  if (!informe) return null;

  const { metadata, servicios, costo_estimado, evaluacion_presupuesto,
    top_3_servicios, nivel_riesgo, modelo_pricing, region_recomendada,
    well_architected, alternativa_menor_costo, analisis_migracion,
    buenas_practicas, limitaciones_estimado, resumen } = informe;

  const handleDescargarPDF = async () => {
    setDescargando(true);
    setErrorPdf('');
    try {
      const res = await fetch(reportUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/pdf'
        },
        body: JSON.stringify({ estimacion: informe }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Error generando el PDF');
      }
      const blob = await res.blob();
      const pdfBlob = new Blob([blob], { type: 'application/pdf' });
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'informe_secc_aws.pdf';
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setErrorPdf(e.message);
    } finally {
      setDescargando(false);
    }
  };

  const refLic = region_recomendada?.referencia_licenciamiento || {};
  const tieneRefLic = refLic.costo_sqlserver_usd > 0 ||
                      refLic.costo_oracle_usd > 0 ||
                      refLic.costo_windows_server_usd > 0;

  const formatPrecio = (precio) => {
    if (!precio && precio !== 0) return '$0.00';
    if (precio < 0.01) return `$${precio.toFixed(4)}`;
    return `$${precio.toFixed(2)}`;
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto' }}>

      {/* Header del informe */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#9A7209' }}>
            Informe ejecutivo de costos
          </h2>
          <p style={{ color: '#555', fontSize: '0.9rem', marginTop: '4px' }}>
            Escenario: <strong>{metadata?.escenario}</strong> · Generado: {metadata?.fecha_ejecucion?.slice(0, 10)}
          </p>
        </div>
      </div>

      {/* Métricas principales */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Costo mensual', valor: `$${costo_estimado?.costo_mensual?.toLocaleString()} USD` },
          { label: 'Costo al horizonte', valor: `$${costo_estimado?.costo_horizonte?.toLocaleString()} USD` },
          { label: 'Periodo', valor: costo_estimado?.periodo },
          { label: '% del presupuesto', valor: `${evaluacion_presupuesto?.porcentaje_del_presupuesto?.toFixed(1)}%` },
          { label: 'Estado', valor: evaluacion_presupuesto?.dentro_presupuesto ? '✅ Dentro' : '❌ Excede' },
          { label: 'Nivel de riesgo', valor: nivel_riesgo?.clasificacion }
        ].map((m, i) => (
          <div key={i} className="card" style={{ textAlign: 'center', padding: '1rem' }}>
            <p style={{ fontSize: '0.75rem', color: '#777', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{m.label}</p>
            <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1A1A1A' }}>{m.valor}</p>
          </div>
        ))}
      </div>

      {/* Resumen ejecutivo */}
      <div className="card" style={{ marginBottom: '1.5rem', borderLeft: '4px solid #C8960C' }}>
        <SeccionTitle>Resumen ejecutivo</SeccionTitle>
        <p style={{ fontSize: '0.9rem', color: '#444', lineHeight: 1.7 }}>{resumen}</p>
      </div>

      {/* Top 3 servicios */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <SeccionTitle>Top 3 servicios de mayor costo</SeccionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          {top_3_servicios?.map((s, i) => (
            <div key={i} style={{ background: '#FFF8E1', borderRadius: '10px', padding: '1rem', border: '1px solid #F0B429' }}>
              <p style={{ fontSize: '0.75rem', color: '#9A7209', fontWeight: 600 }}>#{i + 1}</p>
              <p style={{ fontWeight: 700, fontSize: '1rem', margin: '4px 0' }}>{s.servicio_aws}</p>
              <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '6px' }}>{s.configuracion_minima}</p>
              <p style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1E7C3A' }}>${s.costo_mensual?.toLocaleString()}/mes</p>
              <p style={{ fontSize: '0.8rem', color: '#888' }}>{s.porcentaje_del_total?.toFixed(1)}% del total</p>
            </div>
          ))}
        </div>
      </div>

      {/* Servicios propuestos — COLAPSABLE */}
      <SeccionColapsable titulo={`Servicios propuestos (${servicios?.length} servicios)`}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', tableLayout: 'fixed' }}>
            <colgroup>
              <col style={{ width: '32%' }} />
              <col style={{ width: '30%' }} />
              <col style={{ width: '20%' }} />
              <col style={{ width: '18%' }} />
            </colgroup>
            <thead>
              <tr style={{ background: '#FFF8E1' }}>
                {[
                  { label: 'Servicio', align: 'left' },
                  { label: 'Configuración mínima', align: 'left' },
                  { label: 'Precio unitario', align: 'right' },
                  { label: 'Costo mensual', align: 'right' },
                ].map(h => (
                  <th key={h.label} style={{
                    padding: '10px 12px',
                    textAlign: h.align,
                    color: '#9A7209',
                    fontWeight: 600,
                    borderBottom: '2px solid #F0B429',
                    whiteSpace: 'nowrap'
                  }}>{h.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {servicios?.map((s, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #EEE', background: i % 2 === 0 ? '#FAFAFA' : '#FFF' }}>
                  <td style={{ padding: '12px 12px' }}>
                    <p style={{ fontWeight: 600, fontSize: '0.85rem', margin: 0, color: '#1A1A1A' }}>{s.servicio_aws}</p>
                    <p style={{ fontSize: '0.75rem', color: '#777', margin: '4px 0 0', lineHeight: 1.4 }}>{s.justificacion}</p>
                  </td>
                  <td style={{ padding: '12px 12px', fontSize: '0.8rem', color: '#555', verticalAlign: 'top' }}>
                    {s.configuracion_minima}
                  </td>
                  <td style={{ padding: '12px 12px', textAlign: 'right', verticalAlign: 'top', color: '#1A1A1A', fontWeight: 600, fontSize: '0.82rem' }}>
                    <span style={{ display: 'block' }}>{formatPrecio(s.precio_unitario)}</span>
                    <span style={{ fontSize: '0.72rem', color: '#777', fontWeight: 400 }}>{s.unidad}</span>
                  </td>
                  <td style={{ padding: '12px 12px', textAlign: 'right', fontWeight: 700, color: '#1E7C3A', verticalAlign: 'top', whiteSpace: 'nowrap' }}>
                    ${s.costo_mensual?.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ background: '#FFF8E1', borderTop: '2px solid #F0B429' }}>
                <td colSpan={3} style={{ padding: '10px 12px', fontWeight: 700, color: '#9A7209', fontSize: '0.85rem', textAlign: 'right' }}>
                  Total mensual
                </td>
                <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700, fontSize: '1rem', color: '#1A1A1A', whiteSpace: 'nowrap' }}>
                  ${costo_estimado?.costo_mensual?.toLocaleString()} USD
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </SeccionColapsable>

      {/* Well-Architected */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <SeccionTitle>AWS Well-Architected — Optimización de costos</SeccionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
          {[
            { label: 'Costo actual', valor: `$${costo_estimado?.costo_mensual?.toLocaleString()} USD/mes` },
            { label: 'Costo optimizado', valor: `$${(costo_estimado?.costo_mensual - well_architected?.ahorro_estimado_usd)?.toLocaleString()} USD/mes` },
            { label: 'Ahorro estimado', valor: `$${well_architected?.ahorro_estimado_usd?.toLocaleString()} USD/mes`, verde: true }
          ].map((m, i) => (
            <div key={i} style={{ background: m.verde ? '#E8F5E9' : '#F5F5F5', borderRadius: '10px', padding: '1rem', textAlign: 'center' }}>
              <p style={{ fontSize: '0.75rem', color: '#777', marginBottom: '4px' }}>{m.label}</p>
              <p style={{ fontSize: '1rem', fontWeight: 700, color: m.verde ? '#1E7C3A' : '#1A1A1A' }}>{m.valor}</p>
            </div>
          ))}
        </div>
        <p style={{ fontSize: '0.85rem', color: '#555', lineHeight: 1.6, marginBottom: '0.75rem' }}><strong>Evaluación:</strong> {well_architected?.evaluacion}</p>
        <p style={{ fontSize: '0.85rem', color: '#555', lineHeight: 1.6 }}><strong>Recomendación:</strong> {well_architected?.recomendacion}</p>
      </div>

      {/* Modelo pricing y región — COLAPSABLE */}
      <SeccionColapsable titulo="Modelo de pricing recomendado">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div>
            {modelo_pricing?.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '8px 0', borderBottom: '1px solid #EEE', gap: '8px' }}>
                <div>
                  <p style={{ fontWeight: 600, fontSize: '0.85rem' }}>{m.servicio_aws}</p>
                  <p style={{ fontSize: '0.75rem', color: '#777' }}>{m.justificacion}</p>
                </div>
                <Badge texto={m.modelo_recomendado} tipo={m.modelo_recomendado === 'On-Demand' ? 'info' : 'ok'} />
              </div>
            ))}
          </div>
          <div>
            <p style={{ fontWeight: 600, fontSize: '0.85rem', color: '#9A7209', marginBottom: '0.5rem' }}>Región recomendada</p>
            <div style={{ background: '#FFF8E1', borderRadius: '10px', padding: '1rem', marginBottom: '0.75rem' }}>
              <p style={{ fontWeight: 700, fontSize: '1rem', color: '#9A7209' }}>{region_recomendada?.region}</p>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#555', lineHeight: 1.6, marginBottom: '1rem' }}>{region_recomendada?.justificacion}</p>

            {region_recomendada?.motor_recomendado && region_recomendada.motor_recomendado !== 'N/A' && (
              <div style={{ marginBottom: '1rem' }}>
                <p style={{ fontWeight: 600, fontSize: '0.85rem', color: '#1E7C3A', marginBottom: '0.4rem' }}>Motor de base de datos recomendado</p>
                <div style={{ background: '#E8F5E9', borderRadius: '8px', padding: '0.75rem' }}>
                  <p style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1E7C3A', marginBottom: '4px' }}>{region_recomendada.motor_recomendado}</p>
                  <p style={{ fontSize: '0.8rem', color: '#555', lineHeight: 1.5 }}>{region_recomendada.justificacion_motor}</p>
                </div>
              </div>
            )}

            {tieneRefLic && (
              <div>
                <p style={{ fontWeight: 600, fontSize: '0.85rem', color: '#9A7209', marginBottom: '0.4rem' }}>Referencia de licenciamiento</p>
                <p style={{ fontSize: '0.75rem', color: '#888', fontStyle: 'italic', marginBottom: '0.5rem' }}>{refLic.nota}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {refLic.costo_sqlserver_usd > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                      <span style={{ color: '#555' }}>SQL Server en RDS</span>
                      <span style={{ fontWeight: 700, color: '#C62828' }}>+${refLic.costo_sqlserver_usd?.toLocaleString()} USD/mes</span>
                    </div>
                  )}
                  {refLic.costo_oracle_usd > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                      <span style={{ color: '#555' }}>Oracle en RDS</span>
                      <span style={{ fontWeight: 700, color: '#C62828' }}>+${refLic.costo_oracle_usd?.toLocaleString()} USD/mes</span>
                    </div>
                  )}
                  {refLic.costo_windows_server_usd > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                      <span style={{ color: '#555' }}>Windows Server en EC2</span>
                      <span style={{ fontWeight: 700, color: '#C62828' }}>+${refLic.costo_windows_server_usd?.toLocaleString()} USD/mes</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </SeccionColapsable>

      {/* Alternativa menor costo */}
      {alternativa_menor_costo?.aplica && (
        <div className="card" style={{ marginBottom: '1.5rem', borderLeft: '4px solid #1E7C3A' }}>
          <SeccionTitle>Alternativa de menor costo</SeccionTitle>
          <p style={{ fontSize: '0.85rem', color: '#555', lineHeight: 1.6, marginBottom: '0.5rem' }}>{alternativa_menor_costo?.descripcion}</p>
          <p style={{ fontWeight: 700, color: '#1E7C3A' }}>Ahorro estimado: ${alternativa_menor_costo?.ahorro_estimado?.toLocaleString()} USD</p>
        </div>
      )}

      {/* Análisis de migración */}
      {analisis_migracion?.aplica && (
        <div className="card" style={{ marginBottom: '1.5rem', borderLeft: '4px solid #1565C0' }}>
          <SeccionTitle>Análisis de migración</SeccionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            {[
              { label: 'Costo actual (on-premise)', valor: `$${analisis_migracion?.costo_actual_estimado_usd?.toLocaleString()} USD/mes` },
              { label: 'Ahorro mensual estimado', valor: `$${analisis_migracion?.ahorro_mensual_estimado_usd?.toLocaleString()} USD/mes` },
              { label: 'Período de retorno', valor: analisis_migracion?.periodo_retorno_inversion }
            ].map((m, i) => (
              <div key={i} style={{ background: '#E3F2FD', borderRadius: '10px', padding: '1rem', textAlign: 'center' }}>
                <p style={{ fontSize: '0.75rem', color: '#1565C0', marginBottom: '4px' }}>{m.label}</p>
                <p style={{ fontWeight: 700, color: '#1A1A1A' }}>{m.valor}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Buenas prácticas — COLAPSABLE */}
      <SeccionColapsable titulo="Buenas prácticas de gestión de costos">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div>
            <p style={{ fontWeight: 600, fontSize: '0.85rem', color: '#9A7209', marginBottom: '0.5rem' }}>Etiquetado recomendado</p>
            <div style={{ background: '#F5F5F5', borderRadius: '8px', padding: '0.75rem', fontFamily: 'monospace', fontSize: '0.8rem' }}>
              {buenas_practicas?.etiquetado_ejemplo && Object.entries(buenas_practicas.etiquetado_ejemplo).map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0', borderBottom: '1px solid #E0E0E0' }}>
                  <span style={{ color: '#9A7209' }}>{k}</span>
                  <span style={{ color: '#1E7C3A' }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div>
              <p style={{ fontWeight: 600, fontSize: '0.85rem', color: '#9A7209', marginBottom: '4px' }}>AWS Budgets</p>
              <p style={{ fontSize: '0.8rem', color: '#555', lineHeight: 1.5 }}>{buenas_practicas?.budgets}</p>
            </div>
            <div>
              <p style={{ fontWeight: 600, fontSize: '0.85rem', color: '#9A7209', marginBottom: '4px' }}>Cost Explorer</p>
              <p style={{ fontSize: '0.8rem', color: '#555', lineHeight: 1.5 }}>{buenas_practicas?.cost_explorer}</p>
            </div>
          </div>
        </div>
      </SeccionColapsable>

      {/* Limitaciones — COLAPSABLE */}
      <SeccionColapsable titulo="Limitaciones del estimado">
        <ul style={{ paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {limitaciones_estimado?.map((l, i) => (
            <li key={i} style={{ fontSize: '0.85rem', color: '#555', lineHeight: 1.5 }}>{l}</li>
          ))}
        </ul>
      </SeccionColapsable>

      {/* Acciones finales */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', marginTop: '2rem', paddingBottom: '2rem' }}>
        {errorPdf && (
          <div className="error-box">⚠️ {errorPdf}</div>
        )}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn-secondary btn-large" onClick={onNuevaEstimacion}>
            + Nueva evaluación
          </button>
          <button
            className="btn-primary btn-large"
            onClick={handleDescargarPDF}
            disabled={descargando}
            style={{ opacity: descargando ? 0.7 : 1 }}
          >
            {descargando ? '⏳ Generando PDF...' : '⬇ Descargar PDF'}
          </button>
        </div>
      </div>

    </div>
  );
}