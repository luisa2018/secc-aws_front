# SECC-AWS — Frontend

> Sistema de Evaluación de Costos en Cloud (SECC-AWS)  
> Interfaz web estática desplegada en Amazon S3

---

## Descripción

Interfaz web del prototipo SECC-AWS que permite a desarrolladores, arquitectos de software y estudiantes estimar costos de arquitecturas cloud en AWS. El usuario selecciona un estilo arquitectónico, completa los parámetros del escenario y recibe un informe ejecutivo con estimaciones de costos, recomendaciones de optimización y buenas prácticas, generado por un agente de inteligencia artificial.

🌐 **URL del prototipo:** http://secc-aws-app.s3-website-us-east-1.amazonaws.com/

---

## Arquitectura

Aplicación React estática alojada en Amazon S3 con acceso público. Se comunica con el backend mediante llamadas HTTP a Amazon API Gateway.

```
Usuario → Amazon S3 (React App) → Amazon API Gateway → Backend Lambda
```

---

## Estructura del proyecto

```
secc-aws-frontend/
├── .github/
│   └── workflows/          # CI/CD deploy automático a S3
├── public/                 # Archivos estáticos públicos
├── src/
│   ├── components/
│   │   ├── Formulario.js   # Pantalla de selección de arquitectura y parámetros
│   │   └── Informe.js      # Visualización del informe de resultados
│   ├── App.js              # Componente raíz y manejo de estado
│   ├── App.css             # Estilos globales
│   └── index.js            # Entry point de la aplicación
├── .env.production         # Variables de entorno para producción
├── bucket-policy.json      # Política de acceso público al bucket S3
├── package.json
└── package-lock.json
```

---

## Stack tecnológico

| Componente | Tecnología |
|---|---|
| Framework | React 18 |
| Lenguaje | JavaScript (JSX) |
| Estilos | CSS |
| Hospedaje | Amazon S3 (sitio web estático) |
| CI/CD | GitHub Actions |

---

## Flujo de uso

1. El usuario selecciona el estilo de arquitectura (Monolítica, Microservicios, Serverless, Event-Driven o Híbrida)
2. Completa la descripción del sistema y el contexto de evaluación
3. Ajusta los parámetros de arquitectura según su escenario
4. Hace clic en **"Generar evaluación"**
5. Visualiza el informe con estimaciones de costos y recomendaciones
6. Descarga el informe en formato PDF

---

## Ejecución local

### Requisitos previos
- Node.js 18+
- npm

### Instalar dependencias

```bash
cd secc-aws-frontend
npm install
```

### Levantar en modo desarrollo

```bash
npm start
```

La aplicación quedará disponible en `http://localhost:3000`.

### Variables de entorno

Crea un archivo `.env.local` en la raíz con:

```
REACT_APP_API_URL=http://localhost:3000
```

---

## Despliegue en AWS

El despliegue se realiza automáticamente mediante GitHub Actions al hacer push a la rama `main`. También puede realizarse manualmente:

```bash
npm run build
aws s3 sync build/ s3://secc-aws-app --delete
```

---

## Autor

**luisa2018** — Proyecto de grado 2026
