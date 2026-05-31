import React, { useState } from 'react';
import { Box, Network, Cloud, Radio, Layers } from 'lucide-react';

const HORIZONTES = ['mensual', 'trimestral', 'anual'];
const AMBIENTES = ['desarrollo', 'staging', 'produccion'];
const UBICACIONES = ['latinoamerica', 'estados_unidos', 'europa', 'global'];
const IA_TIPOS = ['ninguna', 'apis_externas', 'propia'];
const PLAZOS_COMPROMISO = ['sin_compromiso', '1_año', '3_años'];

const ESTILOS_INFO = [
  {
    key: 'monolitica',
    label: 'Monolítica',
    Icono: Box,
    tooltip: 'Todo en un solo bloque. Como una tienda física donde todo está bajo el mismo techo. Sencilla de arrancar, ideal si tu proyecto está comenzando.'
  },
  {
    key: 'microservicios',
    label: 'Microservicios',
    Icono: Network,
    tooltip: 'Varios equipos trabajando de forma independiente. Como un centro comercial donde cada local funciona solo pero comparten el mismo edificio. Ideal si tu sistema tiene partes que crecen a ritmos diferentes.'
  },
  {
    key: 'serverless',
    label: 'Serverless',
    Icono: Cloud,
    tooltip: 'Solo pagas cuando alguien usa tu aplicación. Como la luz de tu casa — se prende cuando la necesitas y se apaga sola. Ideal si tu tráfico es variable o impredecible.'
  },
  {
    key: 'event_driven',
    label: 'Event-Driven',
    Icono: Radio,
    tooltip: 'Tu sistema reacciona a lo que pasa. Como una alarma que se activa sola cuando detecta movimiento. Ideal para procesar grandes volúmenes de información en tiempo real.'
  },
  {
    key: 'hibrida',
    label: 'Híbrida',
    Icono: Layers,
    tooltip: 'Una mezcla de estilos según lo que necesita cada parte. Como una ciudad donde hay casas, edificios y parques, cada uno con su propósito. Ideal cuando tu proyecto tiene componentes muy diferentes entre sí.'
  }
];

const REFERENCIAS = {
  monolitica: {
    patron_despliegue: 'VMs',
    usuarios_concurrentes: '100-1K',
    tipo_base_datos: 'relacional',
    volumen_datos_inicial: '1-100 GB',
    intensidad_procesamiento: 'ligera',
    cumplimiento: 'ninguno',
    transferencia_mensual: '10-500 GB',
    sla_objetivo: '>99%',
    almacenamiento_archivos: '<100 GB'
  },
  microservicios: {
    patron_despliegue: 'contenedores',
    usuarios_concurrentes: '1K-10K',
    tipo_base_datos: 'mixta',
    volumen_datos_inicial: '100 GB-10 TB',
    intensidad_procesamiento: 'media',
    cumplimiento: 'GDPR',
    transferencia_mensual: '500 GB-10 TB',
    sla_objetivo: '>99.9%',
    almacenamiento_archivos: '100 GB-10 TB'
  },
  serverless: {
    patron_despliegue: 'funciones',
    usuarios_concurrentes: '100-1K',
    tipo_base_datos: 'nosql',
    volumen_datos_inicial: '1-100 GB',
    intensidad_procesamiento: 'ligera',
    cumplimiento: 'ninguno',
    transferencia_mensual: '10-500 GB',
    sla_objetivo: '>99.9%',
    almacenamiento_archivos: '<100 GB'
  },
  event_driven: {
    patron_despliegue: 'funciones',
    usuarios_concurrentes: '1K-10K',
    tipo_base_datos: 'nosql',
    volumen_datos_inicial: '100 GB-10 TB',
    intensidad_procesamiento: 'media',
    cumplimiento: 'GDPR',
    transferencia_mensual: '500 GB-10 TB',
    sla_objetivo: '>99.9%',
    almacenamiento_archivos: '100 GB-10 TB'
  },
  hibrida: {
    patron_despliegue: 'mixto',
    usuarios_concurrentes: '1K-10K',
    tipo_base_datos: 'mixta',
    volumen_datos_inicial: '100 GB-10 TB',
    intensidad_procesamiento: 'media',
    cumplimiento: 'GDPR',
    transferencia_mensual: '500 GB-10 TB',
    sla_objetivo: '>99.9%',
    almacenamiento_archivos: '100 GB-10 TB'
  }
};

const CAMPOS_ARQUITECTURA = [
  { name: 'patron_despliegue', label: 'Patrón de despliegue' },
  { name: 'usuarios_concurrentes', label: 'Usuarios concurrentes' },
  { name: 'tipo_base_datos', label: 'Tipo de base de datos' },
  { name: 'volumen_datos_inicial', label: 'Volumen de datos inicial' },
  { name: 'intensidad_procesamiento', label: 'Intensidad de procesamiento' },
  { name: 'cumplimiento', label: 'Cumplimiento requerido' },
  { name: 'transferencia_mensual', label: 'Transferencia mensual' },
  { name: 'sla_objetivo', label: 'SLA objetivo' },
  { name: 'almacenamiento_archivos', label: 'Almacenamiento de archivos' }
];

function Select({ label, name, value, onChange, options }) {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <select className="form-select" name={name} value={value} onChange={onChange} required>
        <option value="">Seleccionar...</option>
        {options.map(o => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

function TarjetaEstilo({ info, seleccionado, onSeleccionar }) {
  const [tooltip, setTooltip] = useState(false);
  const { Icono } = info;

  return (
    <div
      style={{
        position: 'relative',
        border: seleccionado ? '2px solid #1E7C3A' : '2px solid rgba(30,124,58,0.35)',
        borderRadius: '12px',
        padding: '1.5rem 1rem',
        cursor: 'pointer',
        background: seleccionado ? '#E8F5E9' : '#FAFAFA',
        textAlign: 'center',
        transition: 'all 0.2s',
        boxShadow: seleccionado ? '0 2px 8px rgba(30,124,58,0.15)' : 'none'
      }}
      onClick={() => onSeleccionar(info.key)}
      onMouseEnter={() => setTooltip(true)}
      onMouseLeave={() => setTooltip(false)}
    >
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.6rem' }}>
        <Icono
          size={36}
          color={seleccionado ? '#1E7C3A' : '#9A7209'}
          strokeWidth={1.5}
        />
      </div>
      <div style={{
        fontWeight: 700,
        fontSize: '0.95rem',
        color: seleccionado ? '#1E7C3A' : '#333'
      }}>{info.label}</div>

      {tooltip && (
        <div className="tooltip">
          {info.tooltip}
          <div className="tooltip-arrow" />
        </div>
      )}
    </div>
  );
}

export default function Formulario({ onEstimar, cargando, error }) {
  const [pantalla, setPantalla] = useState('bienvenida');
  const [form, setForm] = useState({
    descripcion: '',
    estilo_arquitectura: '',
    horizonte_tiempo: '',
    presupuesto: '',
    ambiente: '',
    ubicacion_usuarios: '',
    ia_tipo: '',
    plazo_compromiso: '',
    patron_despliegue: '',
    usuarios_concurrentes: '',
    tipo_base_datos: '',
    volumen_datos_inicial: '',
    intensidad_procesamiento: '',
    cumplimiento: '',
    transferencia_mensual: '',
    sla_objetivo: '',
    almacenamiento_archivos: ''
  });

  const refs = REFERENCIAS[form.estilo_arquitectura] || {};

  const formularioCompleto =
    !!form.descripcion &&
    !!form.estilo_arquitectura &&
    !!form.horizonte_tiempo &&
    !!form.presupuesto &&
    !!form.ambiente &&
    !!form.ubicacion_usuarios &&
    !!form.ia_tipo &&
    !!form.plazo_compromiso &&
    !!form.patron_despliegue &&
    !!form.usuarios_concurrentes &&
    !!form.tipo_base_datos &&
    !!form.volumen_datos_inicial &&
    !!form.intensidad_procesamiento &&
    !!form.cumplimiento &&
    !!form.transferencia_mensual &&
    !!form.sla_objetivo &&
    !!form.almacenamiento_archivos;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSeleccionarEstilo = (estilo) => {
    setForm(prev => ({ ...prev, estilo_arquitectura: estilo }));
    setPantalla('formulario');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formularioCompleto) return;
    const datos = {
      contexto_evaluacion: {
        descripcion: form.descripcion,
        estilo_arquitectura: form.estilo_arquitectura,
        horizonte_tiempo: form.horizonte_tiempo,
        presupuesto: parseFloat(form.presupuesto),
        ambiente: form.ambiente,
        ubicacion_usuarios: form.ubicacion_usuarios,
        ia_tipo: form.ia_tipo,
        plazo_compromiso: form.plazo_compromiso
      },
      arquitectura: {
        patron_despliegue: form.patron_despliegue,
        usuarios_concurrentes: form.usuarios_concurrentes,
        tipo_base_datos: form.tipo_base_datos,
        volumen_datos_inicial: form.volumen_datos_inicial,
        intensidad_procesamiento: form.intensidad_procesamiento,
        cumplimiento: form.cumplimiento,
        transferencia_mensual: form.transferencia_mensual,
        sla_objetivo: form.sla_objetivo,
        almacenamiento_archivos: form.almacenamiento_archivos
      }
    };
    onEstimar(datos);
  };

  // Pantalla de bienvenida
  if (pantalla === 'bienvenida') {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="card" style={{ marginBottom: '2rem', textAlign: 'center', padding: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#9A7209', marginBottom: '1rem' }}>
            ¡Bienvenido a SECC-AWS!
          </h2>
          <p style={{ fontSize: '1rem', color: '#333', fontWeight: 700, lineHeight: 1.7, maxWidth: '640px', margin: '0 auto' }}>
            SECC-AWS analiza escenarios de arquitectura mediante parámetros comunes para proponer
            una posible implementación en AWS. Genera evaluación de costos y recomendaciones
            orientadas al Well-Architected Framework, teniendo en cuenta que se trata de una
            evaluación pre-despliegue.
          </p>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1E7C3A', marginBottom: '0.5rem' }}>
            Para comenzar, selecciona el estilo de arquitectura de tu proyecto:
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#999', marginBottom: '1.5rem', fontStyle: 'italic' }}>
            Pasa el mouse por cada opción para ver una descripción.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
            {ESTILOS_INFO.map(info => (
              <TarjetaEstilo
                key={info.key}
                info={info}
                seleccionado={form.estilo_arquitectura === info.key}
                onSeleccionar={handleSeleccionarEstilo}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Pantalla de formulario
  const estiloInfo = ESTILOS_INFO.find(e => e.key === form.estilo_arquitectura);
  const { Icono: IconoSeleccionado } = estiloInfo || {};

  return (
    <div className="formulario-container">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {IconoSeleccionado && <IconoSeleccionado size={22} color="#1E7C3A" strokeWidth={1.5} />}
          <span style={{ fontWeight: 700, color: '#1E7C3A', fontSize: '1rem' }}>{estiloInfo?.label}</span>
        </div>
        <button
          className="btn-volver"
          onClick={() => {
            setPantalla('bienvenida');
            setForm(prev => ({ ...prev, estilo_arquitectura: '' }));
          }}
        >
          ← Cambiar arquitectura
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 className="seccion-title">Descripción de la arquitectura</h3>
          <div className="form-group">
            <label className="form-label">Descripción del sistema</label>
            <textarea
              className="form-textarea"
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              placeholder="Ej: Plataforma SaaS de gestión empresarial con múltiples módulos independientes..."
              rows={4}
            />
          </div>
        </div>

        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 className="seccion-title">Contexto de evaluación</h3>
          <div className="form-grid">
            <Select label="Horizonte de tiempo" name="horizonte_tiempo" value={form.horizonte_tiempo} onChange={handleChange} options={HORIZONTES} />
            <Select label="Ambiente" name="ambiente" value={form.ambiente} onChange={handleChange} options={AMBIENTES} />
            <Select label="Ubicación de usuarios" name="ubicacion_usuarios" value={form.ubicacion_usuarios} onChange={handleChange} options={UBICACIONES} />
            <Select label="Tipo de IA" name="ia_tipo" value={form.ia_tipo} onChange={handleChange} options={IA_TIPOS} />
            <Select label="Plazo de compromiso" name="plazo_compromiso" value={form.plazo_compromiso} onChange={handleChange} options={PLAZOS_COMPROMISO} />
            <div className="form-group">
              <label className="form-label">Presupuesto disponible (USD)</label>
              <input
                className="form-input"
                type="number"
                name="presupuesto"
                value={form.presupuesto}
                onChange={handleChange}
                placeholder="Ej: 5000"
                min="1"
              />
            </div>
          </div>
        </div>

        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 className="seccion-title">Parámetros de arquitectura</h3>
          <p style={{ fontSize: '0.85rem', color: '#9A7209', marginBottom: '1rem', fontStyle: 'italic' }}>
            💡 Los valores sugeridos son referencias para arquitectura <strong>{estiloInfo?.label}</strong>. Puedes ajustarlos libremente.
          </p>
          <div className="form-grid">
            {CAMPOS_ARQUITECTURA.map(campo => (
              <div key={campo.name} className="form-group">
                <label className="form-label">{campo.label}</label>
                <input
                  className="form-input"
                  type="text"
                  name={campo.name}
                  value={form[campo.name]}
                  onChange={handleChange}
                  placeholder={refs[campo.name] || 'Ingresa un valor...'}
                />
              </div>
            ))}
          </div>
        </div>

        {error && <div className="error-box">⚠️ {error}</div>}

        <div className="form-actions">
          {cargando ? (
            <div className="loading-overlay">
              <div className="spinner"></div>
              <p className="loading-text">⚙️ Evaluación en proceso...</p>
              <p className="loading-sub">Estamos consultando los precios reales en AWS. Esto puede demorar unos minutos.</p>
            </div>
          ) : (
            <button
              type="submit"
              className="btn-primary btn-large"
              disabled={!formularioCompleto}
              style={{
                opacity: formularioCompleto ? 1 : 0.4,
                cursor: formularioCompleto ? 'pointer' : 'not-allowed',
                filter: formularioCompleto ? 'none' : 'grayscale(30%)'
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
                <svg width="20" height="20" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="19" cy="19" r="14" stroke="white" strokeWidth="3" fill="none"/>
                  <line x1="29" y1="29" x2="41" y2="41" stroke="white" strokeWidth="3.5" strokeLinecap="round"/>
                </svg>
                Generar evaluación
              </span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
}