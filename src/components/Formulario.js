import React, { useState } from 'react';
import { Box, Network, Cloud, Radio, Layers } from 'lucide-react';

const HORIZONTES = ['mensual', 'trimestral', 'anual'];
const AMBIENTES = ['desarrollo', 'staging', 'produccion'];
const UBICACIONES = ['latinoamerica', 'estados_unidos', 'europa', 'global'];
const IA_TIPOS = ['ninguna', 'apis_externas', 'propia'];
const PLAZOS_COMPROMISO = ['sin_compromiso', '1_año', '3_años'];

const TOOLTIPS_CONTEXTO = {
  horizonte_tiempo: '¿Por cuánto tiempo quieres proyectar los costos? Mensual = 1 mes, Trimestral = 3 meses, Anual = 12 meses.',
  ambiente: '¿En qué etapa está tu proyecto? Desarrollo = pruebas internas, Staging = pruebas finales antes de salir, Producción = disponible para usuarios reales.',
  ubicacion_usuarios: '¿Desde dónde accederán los usuarios a tu aplicación? Esto define en qué región de AWS se desplegará.',
  ia_tipo: '¿Tu aplicación usa inteligencia artificial? Ninguna = no usa IA, APIs externas = usa servicios como ChatGPT, Propia = tienes tu propio modelo de IA.',
  plazo_compromiso: '¿Cuánto tiempo planeas usar AWS? Sin compromiso = pagas mes a mes. 1 o 3 años = obtienes descuentos a cambio de un compromiso de uso.',
  presupuesto: '¿Cuánto dinero mensual tienes disponible para pagar los servicios en AWS? Ingresa el valor en dólares (USD).'
};

const TOOLTIPS_ARQUITECTURA = {
  patron_despliegue: '¿Cómo se ejecuta tu aplicación? VMs = servidores virtuales tradicionales, Contenedores = más ligeros y portables, Funciones = solo se ejecutan cuando hay peticiones.',
  usuarios_concurrentes: '¿Cuántas personas usarán tu app al mismo tiempo? Ej: 100 = app interna pequeña, 10.000 = e-commerce activo.',
  tipo_base_datos: '¿Cómo organizas tus datos? Relacional = tablas como Excel (MySQL, PostgreSQL), NoSQL = documentos flexibles (MongoDB), Mixta = ambas.',
  volumen_datos_inicial: '¿Cuánta información tendrá tu base de datos al arrancar? Ej: 10 GB = miles de registros, 1 TB = millones de registros.',
  intensidad_procesamiento: '¿Qué hace tu aplicación principalmente? Ligera = consultas simples y formularios, Media = reportes y procesamiento de archivos, Alta = videos, ML o cálculos complejos.',
  cumplimiento: '¿Tu aplicación debe cumplir alguna norma de protección de datos? Ninguno = sin requisitos especiales, GDPR = normativa europea de privacidad, HIPAA = datos de salud en EE.UU.',
  transferencia_mensual: '¿Cuántos datos envía tu app a los usuarios cada mes? Ej: 10 GB = app pequeña, 1 TB = plataforma con muchos archivos o videos.',
  sla_objetivo: '¿Cuánta disponibilidad necesitas? >99% = puede estar caído máx. 3 días/año, >99.9% = máx. 8 horas/año, >99.99% = máx. 1 hora/año.',
  almacenamiento_archivos: '¿Cuánto espacio necesitas para guardar archivos como imágenes, documentos o videos? Ej: 10 GB = fotos de perfil, 1 TB = plataforma de videos.'
};

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
    usuarios_concurrentes: 'Ej: 500 usuarios',
    tipo_base_datos: 'relacional',
    volumen_datos_inicial: 'Ej: 50 GB',
    intensidad_procesamiento: 'ligera',
    cumplimiento: 'ninguno',
    transferencia_mensual: 'Ej: 100 GB',
    sla_objetivo: '>99%',
    almacenamiento_archivos: 'Ej: 80 GB'
  },
  microservicios: {
    patron_despliegue: 'contenedores',
    usuarios_concurrentes: 'Ej: 5000 usuarios',
    tipo_base_datos: 'mixta',
    volumen_datos_inicial: 'Ej: 500 GB',
    intensidad_procesamiento: 'media',
    cumplimiento: 'GDPR',
    transferencia_mensual: 'Ej: 2 TB',
    sla_objetivo: '>99.9%',
    almacenamiento_archivos: 'Ej: 1 TB'
  },
  serverless: {
    patron_despliegue: 'funciones',
    usuarios_concurrentes: 'Ej: 300 usuarios',
    tipo_base_datos: 'nosql',
    volumen_datos_inicial: 'Ej: 20 GB',
    intensidad_procesamiento: 'ligera',
    cumplimiento: 'ninguno',
    transferencia_mensual: 'Ej: 50 GB',
    sla_objetivo: '>99.9%',
    almacenamiento_archivos: 'Ej: 50 GB'
  },
  event_driven: {
    patron_despliegue: 'funciones',
    usuarios_concurrentes: 'Ej: 2000 usuarios',
    tipo_base_datos: 'nosql',
    volumen_datos_inicial: 'Ej: 500 GB',
    intensidad_procesamiento: 'media',
    cumplimiento: 'GDPR',
    transferencia_mensual: 'Ej: 1 TB',
    sla_objetivo: '>99.9%',
    almacenamiento_archivos: 'Ej: 500 GB'
  },
  hibrida: {
    patron_despliegue: 'mixto',
    usuarios_concurrentes: 'Ej: 3000 usuarios',
    tipo_base_datos: 'mixta',
    volumen_datos_inicial: 'Ej: 2 TB',
    intensidad_procesamiento: 'media',
    cumplimiento: 'GDPR',
    transferencia_mensual: 'Ej: 2 TB',
    sla_objetivo: '>99.9%',
    almacenamiento_archivos: 'Ej: 2 TB'
  }
};

const CAMPOS_ARQUITECTURA = [
  { name: 'patron_despliegue', label: 'Patrón de Despliegue' },
  { name: 'usuarios_concurrentes', label: 'Usuarios Concurrentes' },
  { name: 'tipo_base_datos', label: 'Tipo de Base de Datos' },
  { name: 'volumen_datos_inicial', label: 'Volumen de Datos Inicial' },
  { name: 'intensidad_procesamiento', label: 'Intensidad de Procesamiento' },
  { name: 'cumplimiento', label: 'Cumplimiento Requerido' },
  { name: 'transferencia_mensual', label: 'Transferencia Mensual' },
  { name: 'sla_objetivo', label: 'SLA Objetivo' },
  { name: 'almacenamiento_archivos', label: 'Almacenamiento de Archivos' }
];

function TooltipInfo({ texto }) {
  const [visible, setVisible] = useState(false);
  return (
    <span className="tooltip-info-wrapper">
      <span
        className="tooltip-info-trigger"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
      >
        ?
      </span>
      {visible && (
        <div className="tooltip-info-box">
          {texto}
          <div className="tooltip-info-arrow" />
        </div>
      )}
    </span>
  );
}

function Select({ label, name, value, onChange, options, tooltip }) {
  return (
    <div className="form-group">
      <label className="form-label">
        {label}
        {tooltip && <TooltipInfo texto={tooltip} />}
      </label>
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
        boxShadow: seleccionado ? '0 2px 8px rgba(30,124,58,0.15)' : 'none',
        overflow: 'visible'
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
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1E7C3A', marginBottom: '0.25rem' }}>
            Para comenzar, selecciona el estilo de arquitectura de tu proyecto:
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#555', marginBottom: '0.5rem', lineHeight: 1.6 }}>
            <strong>¿Qué es un estilo de arquitectura?</strong> Es la forma en que está organizado
            el código y los componentes de tu aplicación. Si no sabes cuál usa tu proyecto,
            consúltalo con tu equipo de desarrollo.
          </p>
          <p style={{ fontSize: '0.85rem', color: '#999', marginBottom: '1.5rem', fontStyle: 'italic' }}>
            Pasa el mouse por cada opción para ver una descripción.
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '1rem',
            overflow: 'visible'
          }}>
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
          <h3 className="seccion-title">Descripción de la Arquitectura</h3>
          <div className="form-group">
            <label className="form-label">Descripción del Sistema</label>
            <textarea
              className="form-textarea"
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              placeholder="Ej: E-commerce para venta de productos en Latinoamérica..."
              rows={4}
            />
          </div>
        </div>

        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 className="seccion-title">Contexto de Evaluación</h3>
          <div className="form-grid">
            <Select label="Horizonte de Tiempo" name="horizonte_tiempo" value={form.horizonte_tiempo} onChange={handleChange} options={HORIZONTES} tooltip={TOOLTIPS_CONTEXTO.horizonte_tiempo} />
            <Select label="Ambiente" name="ambiente" value={form.ambiente} onChange={handleChange} options={AMBIENTES} tooltip={TOOLTIPS_CONTEXTO.ambiente} />
            <Select label="Ubicación de Usuarios" name="ubicacion_usuarios" value={form.ubicacion_usuarios} onChange={handleChange} options={UBICACIONES} tooltip={TOOLTIPS_CONTEXTO.ubicacion_usuarios} />
            <Select label="Tipo de IA" name="ia_tipo" value={form.ia_tipo} onChange={handleChange} options={IA_TIPOS} tooltip={TOOLTIPS_CONTEXTO.ia_tipo} />
            <Select label="Plazo de Compromiso" name="plazo_compromiso" value={form.plazo_compromiso} onChange={handleChange} options={PLAZOS_COMPROMISO} tooltip={TOOLTIPS_CONTEXTO.plazo_compromiso} />
            <div className="form-group">
              <label className="form-label">
                Presupuesto Disponible (USD)
                <TooltipInfo texto={TOOLTIPS_CONTEXTO.presupuesto} />
              </label>
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
          <h3 className="seccion-title">Parámetros de Arquitectura</h3>
          <p style={{ fontSize: '0.85rem', color: '#9A7209', marginBottom: '1rem', fontStyle: 'italic' }}>
            💡 Los valores sugeridos son referencias para arquitectura <strong>{estiloInfo?.label}</strong>. Puedes ajustarlos libremente.
          </p>
          <div className="form-grid">
            {CAMPOS_ARQUITECTURA.map(campo => (
              <div key={campo.name} className="form-group">
                <label className="form-label">
                  {campo.label}
                  {TOOLTIPS_ARQUITECTURA[campo.name] && (
                    <TooltipInfo texto={TOOLTIPS_ARQUITECTURA[campo.name]} />
                  )}
                </label>
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