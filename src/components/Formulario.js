import React, { useState } from 'react';

const ESTILOS = ['monolitica', 'microservicios', 'serverless', 'event_driven', 'hibrida'];
const HORIZONTES = ['mensual', 'trimestral', 'anual'];
const AMBIENTES = ['desarrollo', 'staging', 'produccion'];
const UBICACIONES = ['latinoamerica', 'estados_unidos', 'europa', 'global'];
const IA_TIPOS = ['ninguna', 'apis_externas', 'propia'];

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
      <select
        className="form-select"
        name={name}
        value={value}
        onChange={onChange}
        required
      >
        <option value="">Seleccionar...</option>
        {options.map(o => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

export default function Formulario({ onEstimar, cargando, error }) {
  const [form, setForm] = useState({
    descripcion: '',
    estilo_arquitectura: '',
    horizonte_tiempo: '',
    presupuesto: '',
    ambiente: '',
    ubicacion_usuarios: '',
    ia_tipo: '',
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const datos = {
      contexto_evaluacion: {
        descripcion: form.descripcion,
        estilo_arquitectura: form.estilo_arquitectura,
        horizonte_tiempo: form.horizonte_tiempo,
        presupuesto: parseFloat(form.presupuesto),
        ambiente: form.ambiente,
        ubicacion_usuarios: form.ubicacion_usuarios,
        ia_tipo: form.ia_tipo
      },
      arquitectura: {
        patron_despliegue: form.patron_despliegue || refs.patron_despliegue || '',
        usuarios_concurrentes: form.usuarios_concurrentes || refs.usuarios_concurrentes || '',
        tipo_base_datos: form.tipo_base_datos || refs.tipo_base_datos || '',
        volumen_datos_inicial: form.volumen_datos_inicial || refs.volumen_datos_inicial || '',
        intensidad_procesamiento: form.intensidad_procesamiento || refs.intensidad_procesamiento || '',
        cumplimiento: form.cumplimiento || refs.cumplimiento || '',
        transferencia_mensual: form.transferencia_mensual || refs.transferencia_mensual || '',
        sla_objetivo: form.sla_objetivo || refs.sla_objetivo || '',
        almacenamiento_archivos: form.almacenamiento_archivos || refs.almacenamiento_archivos || ''
      }
    };
    onEstimar(datos);
  };

  return (
    <div className="formulario-container">
      <div className="formulario-header">
        <h2>Evaluación de costos AWS</h2>
        <p>Complete los parámetros de su arquitectura para generar el informe ejecutivo</p>
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
              rows={3}
              required
            />
          </div>
        </div>

        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 className="seccion-title">Contexto de evaluación</h3>
          <div className="form-grid">
            <Select label="Estilo de arquitectura" name="estilo_arquitectura" value={form.estilo_arquitectura} onChange={handleChange} options={ESTILOS} />
            <Select label="Horizonte de tiempo" name="horizonte_tiempo" value={form.horizonte_tiempo} onChange={handleChange} options={HORIZONTES} />
            <Select label="Ambiente" name="ambiente" value={form.ambiente} onChange={handleChange} options={AMBIENTES} />
            <Select label="Ubicación de usuarios" name="ubicacion_usuarios" value={form.ubicacion_usuarios} onChange={handleChange} options={UBICACIONES} />
            <Select label="Tipo de IA" name="ia_tipo" value={form.ia_tipo} onChange={handleChange} options={IA_TIPOS} />
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
                required
              />
            </div>
          </div>
        </div>

        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 className="seccion-title">Parámetros de arquitectura</h3>
          {!form.estilo_arquitectura && (
            <p style={{ fontSize: '0.85rem', color: '#999', marginBottom: '1rem', fontStyle: 'italic' }}>
              Selecciona un estilo de arquitectura para ver los valores de referencia sugeridos.
            </p>
          )}
          {form.estilo_arquitectura && (
            <p style={{ fontSize: '0.85rem', color: '#9A7209', marginBottom: '1rem', fontStyle: 'italic' }}>
              💡 Los placeholders muestran valores de referencia para <strong>{form.estilo_arquitectura}</strong>. Puedes escribir libremente.
            </p>
          )}
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
                  placeholder={refs[campo.name] || 'Ingrese un valor...'}
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
              <p className="loading-text">El agente está analizando su arquitectura...</p>
              <p className="loading-sub">Consultando precios reales de AWS. Esto puede tomar 1-2 minutos.</p>
            </div>
          ) : (
            <button type="submit" className="btn-primary btn-large">
              ⚡ Generar estimación
            </button>
          )}
        </div>
      </form>
    </div>
  );
}