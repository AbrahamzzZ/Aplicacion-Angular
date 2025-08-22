# Sistema de Ventas - Angular 17 + .NET + SQL Server

Este proyecto es un **Sistema de Ventas** desarrollado con **Angular 17** para el frontend, **.NET** para el backend y **SQL Server** como base de datos.  
Está diseñado para la gestión integral de operaciones de un negocio, con control de usuarios, ventas, compras, inventario, reportes y más.

## 🚀 Características principales

- **Gestión de usuarios con roles y permisos**
  - Roles: Administrador y Empleado
  - Control de acceso a menús y rutas según permisos
  - Autenticación segura con **JWT**

- **Módulos funcionales**
  - **Usuarios**: administración de roles y permisos
  - **Compras**: registro de compras a proveedores y detalle de compras
  - **Ventas**: registro de ventas a clientes y detalle de ventas
  - **Proveedores**: gestión de datos y estado
  - **Clientes**: administración de clientes y datos de contacto
  - **Transportistas**: control de transportistas y asignaciones
  - **Sucursales**: registro con ubicación geográfica (latitud y longitud)
  - **Negocio**: configuración general
  - **Productos**: control de inventario, categorías y precios
  - **Categorías**: organización de productos

- **Reportes y estadísticas**
  - Estadísticas del negocio con gráficas interactivas
  - Exportación de reportes en **PDF** y **Excel**
  - Filtros por fechas, categorías, clientes, proveedores, etc.

## 🛠 Tecnologías utilizadas

- **Frontend:** Angular 17, Angular Material, SCSS, ESLint, Prettier
- **Backend:** .NET 7, API REST, C#, MSTest, Moq
- **Base de datos:** SQL Server
- **Seguridad:** JWT, cifrado SHA-256
- **Reportes:** PDF, Excel

## 📂 Arquitectura del sistema

El sistema sigue un modelo **Cliente-Servidor**:

- **Cliente:** Angular 17 consume los servicios REST.
- **Servidor (API REST):** .NET 7 con Entity Framework (Database First).
- **Base de datos:** SQL Server.

La API está organizada en capas para garantizar escalabilidad y mantenibilidad:

**Controllers**

Reciben solicitudes HTTP, validan parámetros y delegan la lógica de negocio a los servicios.

**Services**

Contienen la lógica de negocio por módulo.

Implementan interfaces para inyección de dependencias.

**Repository**

Acceso a datos usando Entity Framework.

Clases y interfaces por módulo.

**Models**

Clases generadas por EF (Database First).

DTOs para transferencia de datos.

**Helpers**

Funciones auxiliares (e.g., Token.cs para generar/validar JWT).

**Utilities / Shared**

ApiResponse.cs → Respuestas estándar.

Mensajes.cs → Mensajes comunes.

Paginacion.cs → Paginación en consultas.

**Utilities / Security**

Encriptacion.cs → Cifrado de contraseña

## ✅ Buenas practicas
Pruebas unitarias con MSTest y Moq:

  - Tests para Controllers validando respuestas HTTP y estados.
  
  - Tests para Services asegurando la lógica de negocio.
  
  - Uso de Moq para simular dependencias (repositorios, servicios externos).

ESLint configurado para mantener un código consistente.

  - Prettier integrado para formato automático y estilo uniforme.
  
  - Configuración para:
  
    - Estándares de Angular y TypeScript.
    
    - Reglas personalizadas para evitar malas prácticas.
    
    - Integración con VS Code (guardado automático formatea el código).

## ⚙ Instalación y ejecución

### 1️⃣ Backend (.NET)

**Clonar repositorio**
git clone <https://github.com/AbrahamzzZ/Sistema-Supermercado-Backend.git>

**Abrir solución**
Abrir backend.sln en Visual Studio.

**Restaurar dependencias**

En Visual Studio: Herramientas → Administrador de paquetes NuGet → Restaurar paquetes.

**Ejecutar**
Presionar F5 o seleccionar IIS Express / Proyecto y ejecutar la API REST desde Visual Studio.


### 2️⃣ Frontend (Angular 17)

**Clonar repositorio**
git clone <https://github.com/AbrahamzzZ/Sistema-Supermercardo-Frontend.git>

**Entrar a la carpeta del frontend**
cd Frontend

**Instalar dependencias**
npm install

**Ejecutar en modo desarrollo**
ng serve
