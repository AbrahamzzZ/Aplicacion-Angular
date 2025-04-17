--Creacion de la base de datos
CREATE DATABASE Sistema_Supermercado; 
go

USE Sistema_Supermercado;
go

--Modulo Rol Tabla-Procedimiento almacenado-Inserción
CREATE TABLE ROL ( ID_ROL int primary key identity,
NOMBRE varchar(30),
FECHA_CREACION datetime default getdate()
);
GO
CREATE PROCEDURE PA_LISTA_ROL
AS
BEGIN
	SELECT ID_ROL, NOMBRE FROM ROL;
END;
GO
INSERT INTO ROL (NOMBRE)
VALUES ('Administrador'), ('Empleado');

--Modulo Menu Tabla-Procedimiento almacenado-Inserción
CREATE TABLE MENU ( ID_MENU int primary key identity,
NOMBRE_MENU varchar(50),
URL_MENU varchar(50),
NOMBRE_ICONO varchar(50),
FECHA_CREACION datetime default getdate()
);
GO
CREATE PROCEDURE PA_OBTENER_MENU(
@Id_Usuario int
)
AS
BEGIN
	SELECT M.ID_MENU, M.NOMBRE_MENU, M.URL_MENU, M.NOMBRE_ICONO FROM USUARIO U
	INNER JOIN ROL R ON U.ID_ROL = R.ID_ROL
	INNER JOIN PERMISO P ON R.ID_ROL = P.ID_ROL
	INNER JOIN MENU M ON P.ID_MENU = M.ID_MENU
	WHERE U.ID_USUARIO = @Id_Usuario;
END;
GO
INSERT INTO MENU (NOMBRE_MENU, URL_MENU, NOMBRE_ICONO)
VALUES 
('Usuarios', '/usuario', 'person'),
('Productos', '/producto', 'store'),
('Categorias', '/categoria', 'storage'),
('Clientes', '/cliente', 'group'),
('Proveedores', '/proveedor', 'inventory'),
('Transportista', '/transportista', 'local_shipping'),
('Ofertas', '/oferta', 'more');

--Creación de la tabla intermendia Permiso y sus inserciones
CREATE TABLE PERMISO ( ID_PERMISO int primary key identity,
ID_ROL int references ROL(ID_ROL),
ID_MENU int references MENU(ID_MENU)
);
GO
INSERT INTO PERMISO (ID_ROL, ID_MENU)
VALUES 
(1, 1), -- Administrador - Usuarios
(1, 2), -- Administrador - Productos
(1, 3), -- Administrador - Categorías
(1, 4), -- Administrador - Clientes
(1, 5), -- Administrador - Proveedores
(1, 6), -- Administrador - Transportistas
(1, 7); -- Administrador - Ofertas

INSERT INTO PERMISO (ID_ROL, ID_MENU)
VALUES 
(2, 2), -- Empleado - Productos
(2, 7); -- Empleado - Ofertas
GO

--Modulo Usuario Tabla-Procedimientos almacenados
CREATE TABLE USUARIO (ID_USUARIO int primary key identity,
CODIGO varchar(10),
NOMBRE_COMPLETO varchar(70),
CORREO_ELECTRONICO nvarchar(50),
CLAVE nvarchar(300),
ID_ROL int references ROL(ID_ROL),
ESTADO bit,
FECHA_CREACION datetime default getdate()
);
GO 

CREATE PROCEDURE PA_LISTA_USUARIO
AS
BEGIN
	SELECT ID_USUARIO, CODIGO, NOMBRE_COMPLETO, CLAVE, CORREO_ELECTRONICO, R.ID_ROL, R.NOMBRE, ESTADO, U.FECHA_CREACION FROM USUARIO U
	inner join ROL R ON U.ID_ROL = R.ID_ROL;
END;
GO

CREATE PROCEDURE PA_OBTENER_USUARIO(
	@Id_Usuario int
)
AS
BEGIN
	SELECT ID_USUARIO, CODIGO, NOMBRE_COMPLETO, CLAVE, CORREO_ELECTRONICO, R.ID_ROL, R.NOMBRE, ESTADO, U.FECHA_CREACION FROM USUARIO U
	inner join ROL R ON U.ID_ROL = R.ID_ROL WHERE ID_USUARIO = @Id_Usuario;
END;
GO

CREATE PROCEDURE PA_INICIAR_SESION(
@Correo_Electronico varchar(50),
@Clave nvarchar(300)
)
AS 
BEGIN
	SELECT ID_USUARIO, CODIGO, NOMBRE_COMPLETO, CLAVE, CORREO_ELECTRONICO, R.ID_ROL, R.NOMBRE, ESTADO, U.FECHA_CREACION FROM USUARIO U
	inner join ROL R ON U.ID_ROL = R.ID_ROL
	WHERE CORREO_ELECTRONICO = @Correo_Electronico and CLAVE = @Clave;
END;
GO

CREATE PROCEDURE PA_REGISTRAR_USUARIO(
@Codigo varchar(10),
@Nombre_Completo varchar(70),
@Correo_Electronico varchar(50),
@Clave nvarchar(300),
@Id_Rol int,
@Estado bit
)
AS
BEGIN
	INSERT INTO USUARIO(CODIGO, NOMBRE_COMPLETO, CLAVE, CORREO_ELECTRONICO, ID_ROL, ESTADO) 
	values(@Codigo, @Nombre_Completo, @Clave, @Correo_Electronico, @Id_Rol, @Estado);
END;
GO

CREATE PROCEDURE PA_EDITAR_USUARIO(
@Id_Usuario int,
@Nombre_Completo varchar(70),
@Correo_Electronico varchar(50),
@Clave nvarchar(300),
@Id_Rol int,
@Estado bit
)
AS
BEGIN
	UPDATE USUARIO set NOMBRE_COMPLETO = @Nombre_Completo, CORREO_ELECTRONICO = @Correo_Electronico, CLAVE = @Clave, ID_ROL = @Id_Rol, ESTADO = @Estado WHERE ID_USUARIO = @Id_Usuario;
END;
GO

CREATE PROCEDURE PA_ELIMINAR_USUARIO(
@Id_Usuario int
)
AS
BEGIN
	DELETE FROM USUARIO WHERE ID_USUARIO = @Id_Usuario;
END;
GO

--Modulo Proveedor Tabla-Procedimientos almacenados
CREATE TABLE PROVEEDOR (ID_PROVEEDOR int primary key identity,
CODIGO varchar(10),
NOMBRES varchar(30),
APELLIDOS varchar(30),
CEDULA varchar(10),
TELEFONO varchar(10),
CORREO_ELECTRONICO nvarchar(50),
ESTADO bit,
FECHA_REGISTRO datetime default getdate()
);
GO

CREATE PROCEDURE PA_LISTA_PROVEEDOR
AS
BEGIN
	SELECT ID_PROVEEDOR, CODIGO, NOMBRES, APELLIDOS, CEDULA, TELEFONO, CORREO_ELECTRONICO, ESTADO, FECHA_REGISTRO FROM PROVEEDOR;
END;
GO

CREATE PROCEDURE PA_OBTENER_PROVEEDOR(
	@Id_Proveedor int
)
AS
BEGIN
	SELECT ID_PROVEEDOR, CODIGO, NOMBRES, APELLIDOS, CEDULA, TELEFONO, CORREO_ELECTRONICO, ESTADO, FECHA_REGISTRO FROM PROVEEDOR
	WHERE ID_PROVEEDOR = @Id_Proveedor;
END;
GO

CREATE PROCEDURE PA_REGISTRAR_PROVEEDOR(
@Codigo varchar(10),
@Nombres varchar(30),
@Apellidos varchar(30),
@Cedula varchar(10),
@Telefono varchar(10),
@Correo_Electronico varchar(50),
@Estado bit
)
AS
BEGIN
	INSERT INTO PROVEEDOR(CODIGO, NOMBRES, APELLIDOS, CEDULA, TELEFONO, CORREO_ELECTRONICO, ESTADO) 
	values(@Codigo, @Nombres, @Apellidos, @Cedula, @Telefono, @Correo_Electronico, @Estado);
END;
GO

CREATE PROCEDURE PA_EDITAR_PROVEEDOR(
@Id_Proveedor int,
@Nombres varchar(30),
@Apellidos varchar(30),
@Cedula varchar(10),
@Telefono varchar(10),
@Correo_Electronico varchar(50),
@Estado bit
)
AS
BEGIN
	UPDATE PROVEEDOR set NOMBRES = @Nombres, APELLIDOS = @Apellidos, CEDULA = @Cedula, TELEFONO = @Telefono, CORREO_ELECTRONICO = @Correo_Electronico, ESTADO = @Estado WHERE ID_PROVEEDOR = @Id_Proveedor;
END;
GO

CREATE PROCEDURE PA_ELIMINAR_PROVEEDOR(
@Id_Proveedor int
)
AS
BEGIN
	DELETE FROM PROVEEDOR WHERE ID_PROVEEDOR = @Id_Proveedor;
END;

--Modulo Transportista Tabla-Procedimientos almacenados
CREATE TABLE TRANSPORTISTA(ID_TRANSPORTISTA int primary key identity,
CODIGO varchar(10),
NOMBRES varchar(30),
APELLIDOS varchar(30),
CEDULA varchar(10),
TELEFONO varchar(10),
CORREO_ELECTRONICO nvarchar(50),
IMAGEN varbinary(max)NUll,
ESTADO bit,
FECHA_REGISTRO datetime default getdate()
);
GO

CREATE PROCEDURE PA_LISTA_TRANSPORTISTA
AS
BEGIN
	SELECT ID_TRANSPORTISTA, CODIGO, NOMBRES, APELLIDOS, CEDULA, TELEFONO, CORREO_ELECTRONICO, IMAGEN, ESTADO, FECHA_REGISTRO FROM TRANSPORTISTA;
END;
GO

CREATE PROCEDURE PA_OBTENER_TRANSPORTISTA(
	@Id_Transportista int
)
AS
BEGIN
	SELECT ID_TRANSPORTISTA, CODIGO, NOMBRES, APELLIDOS, CEDULA, TELEFONO, CORREO_ELECTRONICO, IMAGEN ,ESTADO, FECHA_REGISTRO FROM TRANSPORTISTA
	WHERE ID_TRANSPORTISTA = @Id_Transportista;
END;
GO

CREATE PROCEDURE PA_REGISTRAR_TRANSPORTISTA(
@Codigo varchar(10),
@Nombres varchar(30),
@Apellidos varchar(30),
@Cedula varchar(10),
@Telefono varchar(10),
@Correo_Electronico varchar(50),
@Imagen varbinary(max) = NULL,
@Estado bit
)
AS
BEGIN
	INSERT INTO TRANSPORTISTA(CODIGO, NOMBRES, APELLIDOS, CEDULA, TELEFONO, CORREO_ELECTRONICO, IMAGEN, ESTADO) 
	values(@Codigo, @Nombres, @Apellidos, @Cedula, @Telefono, @Correo_Electronico, @Imagen, @Estado);
END;
GO

CREATE PROCEDURE PA_EDITAR_TRANSPORTISTA(
@Id_Transportista int,
@Nombres varchar(30),
@Apellidos varchar(30),
@Cedula varchar(10),
@Telefono varchar(10),
@Correo_Electronico varchar(50),
@Imagen varbinary(max) = NULL,
@Estado bit
)
AS
BEGIN
	UPDATE TRANSPORTISTA set NOMBRES = @Nombres, APELLIDOS = @Apellidos, CEDULA = @Cedula, TELEFONO = @Telefono, CORREO_ELECTRONICO = @Correo_Electronico, IMAGEN = @Imagen, ESTADO = @Estado WHERE ID_TRANSPORTISTA = @Id_Transportista;
END;
GO

CREATE PROCEDURE PA_ELIMINAR_TRANSPORTISTA(
@Id_Transportista int
)
AS
BEGIN
	DELETE FROM TRANSPORTISTA WHERE ID_TRANSPORTISTA = @Id_Transportista;
END;
GO

--Modulo Cliente Tabla-Procedimientos almacenados
CREATE TABLE CLIENTE (ID_CLIENTE int primary key identity,
CODIGO varchar(10),
NOMBRES varchar(30),
APELLIDOS varchar(30),
CEDULA varchar(10),
TELEFONO varchar(10),
CORREO_ELECTRONICO nvarchar(50),
FECHA_REGISTRO datetime default getdate()
);
GO

CREATE PROCEDURE PA_LISTA_CLIENTE
AS
BEGIN
	SELECT ID_CLIENTE, CODIGO, NOMBRES, APELLIDOS, CEDULA, TELEFONO, CORREO_ELECTRONICO, FECHA_REGISTRO FROM CLIENTE;
END;
GO

CREATE PROCEDURE PA_OBTENER_CLIENTE(
	@Id_Cliente int
)
AS
BEGIN
	SELECT ID_CLIENTE, CODIGO, NOMBRES, APELLIDOS, CEDULA, TELEFONO, CORREO_ELECTRONICO, FECHA_REGISTRO FROM CLIENTE
	WHERE ID_CLIENTE = @Id_Cliente;
END;
GO

CREATE PROCEDURE PA_REGISTRAR_CLIENTE(
@Codigo varchar(10),
@Nombres varchar(30),
@Apellidos varchar(30),
@Cedula varchar(10),
@Telefono varchar(10),
@Correo_Electronico varchar(50)
)
AS
BEGIN
	INSERT INTO CLIENTE(CODIGO, NOMBRES, APELLIDOS, CEDULA, TELEFONO, CORREO_ELECTRONICO) 
	values(@Codigo, @Nombres, @Apellidos, @Cedula, @Telefono, @Correo_Electronico);
END;
GO

CREATE PROCEDURE PA_EDITAR_CLIENTE(
@Id_Cliente int,
@Nombres varchar(30),
@Apellidos varchar(30),
@Cedula varchar(10),
@Telefono varchar(10),
@Correo_Electronico varchar(50)
)
AS
BEGIN
	UPDATE CLIENTE set NOMBRES = @Nombres, APELLIDOS = @Apellidos, CEDULA = @Cedula, TELEFONO = @Telefono, CORREO_ELECTRONICO = @Correo_Electronico WHERE ID_CLIENTE = @Id_Cliente;
END;
GO

CREATE PROCEDURE PA_ELIMINAR_CLIENTE(
@Id_Cliente int
)
AS
BEGIN
	DELETE FROM CLIENTE WHERE ID_CLIENTE = @Id_Cliente;
END;
GO

--Modulo Categoria Tabla-Procedimientos almacenados-Inserción
CREATE TABLE CATEGORIA ( ID_CATEGORIA INT PRIMARY KEY IDENTITY,
CODIGO varchar(10),
NOMBRE_CATEGORIA nvarchar(50),
ESTADO bit,
FECHA_CREACION datetime default getdate()
);
GO
CREATE PROCEDURE PA_LISTA_CATEGORIA
AS
BEGIN
    SELECT ID_CATEGORIA, CODIGO, NOMBRE_CATEGORIA, ESTADO, FECHA_CREACION FROM CATEGORIA;
END;
GO
CREATE PROCEDURE PA_OBTENER_CATEGORIA(
    @Id_Categoria int
)
AS
BEGIN
    SELECT ID_CATEGORIA, CODIGO, NOMBRE_CATEGORIA, ESTADO, FECHA_CREACION FROM CATEGORIA
    WHERE ID_CATEGORIA = @Id_Categoria;
END;
GO
CREATE PROCEDURE PA_REGISTRAR_CATEGORIA(
    @Codigo varchar(10),
    @Nombre nvarchar(50),
    @Estado bit
)
AS
BEGIN
    INSERT INTO CATEGORIA (CODIGO, NOMBRE_CATEGORIA, ESTADO) VALUES (@Codigo, @Nombre, @Estado);
END;
GO
CREATE PROCEDURE PA_EDITAR_CATEGORIA(
    @Id_Categoria int,
    @Nombre nvarchar(50),
    @Estado bit
)
AS
BEGIN
    UPDATE CATEGORIA SET NOMBRE_CATEGORIA = @Nombre, ESTADO = @Estado WHERE ID_CATEGORIA = @Id_Categoria;
END;
GO
CREATE PROCEDURE PA_ELIMINAR_CATEGORIA(
    @Id_Categoria int
)
AS
BEGIN
    DELETE FROM CATEGORIA WHERE ID_CATEGORIA = @Id_Categoria;
END;
GO

INSERT INTO CATEGORIA(CODIGO, NOMBRE_CATEGORIA, ESTADO) VALUES ('6564', 'Frutas y Verduras',1),
('7845', 'Despensa',1),
('1247', 'Preparados',1),
('0786', 'Bebidas y Licores',1),
('3472', 'Refrigerados',1),
('1308', 'Congelados',1),
('6832', 'Carnes',1),
('1375', 'Embutidos',1),
('3529', 'Panaderia',1),
('4839', 'Mascotas',1),
('3098', 'Cuidado Personal',1),
('4802', 'Cuidado del Hogar',1),
('6796', 'Electrodomésticos',1),
('1378', 'Jarnideria y Plantas',1);

--Modulo Producto Tabla-Procedimientos almacenados
CREATE TABLE PRODUCTO( ID_PRODUCTO int primary key identity,
CODIGO varchar(10),
DESCRIPCION nvarchar(50),
NOMBRE_PRODUCTO nvarchar(30),
ID_CATEGORIA int references CATEGORIA (ID_CATEGORIA),
PAIS_ORIGEN varchar(30),
STOCK int NOT NULL default 0,
PRECIO_VENTA decimal (10,2) default 0,
ESTADO bit,
);
GO

CREATE PROCEDURE PA_LISTA_PRODUCTO
AS
BEGIN
	SELECT ID_PRODUCTO, P.CODIGO, DESCRIPCION, NOMBRE_PRODUCTO, C.ID_CATEGORIA, C.CODIGO AS CODIGO_CATEGORIA, C.NOMBRE_CATEGORIA, C.ESTADO AS ESTADO_CATEGORIA, PAIS_ORIGEN, STOCK, PRECIO_VENTA, P.ESTADO FROM PRODUCTO P
	inner join CATEGORIA C on P.ID_CATEGORIA = C.ID_CATEGORIA;
END;
GO

CREATE PROCEDURE PA_OBTENER_PRODUCTO(
	@Id_Producto int
)
AS
BEGIN
	SELECT ID_PRODUCTO, P.CODIGO, DESCRIPCION, NOMBRE_PRODUCTO, C.ID_CATEGORIA, C.CODIGO AS CODIGO_CATEGORIA, C.NOMBRE_CATEGORIA, C.ESTADO AS ESTADO_CATEGORIA, PAIS_ORIGEN, STOCK, PRECIO_VENTA, P.ESTADO FROM PRODUCTO P
	inner join CATEGORIA C on P.ID_CATEGORIA = C.ID_CATEGORIA
	WHERE ID_PRODUCTO = @Id_Producto
END;
GO

CREATE PROCEDURE PA_REGISTRAR_PRODUCTO(
@Codigo varchar(10),
@Descripion nvarchar(50),
@Nombre_Producto varchar(30),
@Id_Categoria int,
@Pais_Origen varchar(30),
@Stock int,
@Precio_Venta decimal (10,2),
@Estado bit
)
AS
BEGIN
	INSERT INTO PRODUCTO(CODIGO, DESCRIPCION, NOMBRE_PRODUCTO, ID_CATEGORIA, PAIS_ORIGEN, STOCK, PRECIO_VENTA, ESTADO) 
	values(@Codigo, @Descripion, @Nombre_Producto, @Id_Categoria, @Pais_Origen, @Stock, @Precio_Venta, @Estado);
END;
GO

CREATE PROCEDURE PA_EDITAR_PRODUCTO(
@Id_Producto int,
@Descripion nvarchar(50),
@Nombre_Producto varchar(30),
@Id_Categoria int,
@Pais_Origen varchar(30),
@Stock int,
@Precio_Venta decimal (10,2),
@Estado bit
)
AS
BEGIN
	UPDATE PRODUCTO SET DESCRIPCION = @Descripion, NOMBRE_PRODUCTO = @Nombre_Producto, ID_CATEGORIA = @Id_Categoria, PAIS_ORIGEN = @Pais_Origen, STOCK = @Stock, PRECIO_VENTA = @Precio_Venta, ESTADO  = @Estado WHERE ID_PRODUCTO = @Id_Producto;
END;
GO

CREATE PROCEDURE PA_ELIMINAR_PRODUCTO(
@Id_Producto int
)
AS
BEGIN
	DELETE FROM PRODUCTO WHERE ID_PRODUCTO = @Id_Producto;
END;
GO

--Modulo Oferta Tabla-Procedimientos almacenados
CREATE TABLE OFERTA (ID_OFERTA INT PRIMARY KEY IDENTITY,
CODIGO varchar(10),
NOMBRE_OFERTA varchar(50), 
ID_PRODUCTO int references PRODUCTO(ID_PRODUCTO),
DESCRIPCION varchar(250),
FECHA_INICIO date,
FECHA_FIN date,
DESCUENTO decimal(5,2) default 0,
ESTADO bit,
FECHA_CREACION datetime default getdate()
);
GO
CREATE PROCEDURE PA_LISTA_OFERTA
AS
BEGIN
	SELECT ID_OFERTA, O.CODIGO, NOMBRE_OFERTA, P.ID_PRODUCTO, P.CODIGO AS CODIGO_PRODUCTO, P.DESCRIPCION AS DESCRIPCION_PRODUCTO, C.ID_CATEGORIA, C.CODIGO AS CODIGO_CATEGORIA, C.NOMBRE_CATEGORIA, C.ESTADO AS ESTADO_CATEGORIA, P.PAIS_ORIGEN, P.STOCK, P.PRECIO_VENTA, P.ESTADO AS ESTADO_PRODUCTO, P.NOMBRE_PRODUCTO, O.DESCRIPCION, FECHA_INICIO, FECHA_FIN, DESCUENTO, O.ESTADO, O.FECHA_CREACION FROM OFERTA O
	inner join PRODUCTO P on O.ID_PRODUCTO = P.ID_PRODUCTO
	inner join CATEGORIA C on P.ID_CATEGORIA = C.ID_CATEGORIA;
END;
GO

CREATE PROCEDURE PA_OBTENER_OFERTA(
	@Id_Oferta int
)
AS
BEGIN
	SELECT ID_OFERTA, O.CODIGO, NOMBRE_OFERTA, P.ID_PRODUCTO, P.CODIGO AS CODIGO_PRODUCTO, P.DESCRIPCION AS DESCRIPCION_PRODUCTO, C.ID_CATEGORIA, C.CODIGO AS CODIGO_CATEGORIA, C.NOMBRE_CATEGORIA, C.ESTADO AS ESTADO_CATEGORIA, P.PAIS_ORIGEN, P.STOCK, P.PRECIO_VENTA, P.ESTADO AS ESTADO_PRODUCTO, P.NOMBRE_PRODUCTO, O.DESCRIPCION, FECHA_INICIO, FECHA_FIN, DESCUENTO, O.ESTADO, O.FECHA_CREACION FROM OFERTA O
	inner join PRODUCTO P on O.ID_PRODUCTO = P.ID_PRODUCTO
	inner join CATEGORIA C on p.ID_CATEGORIA = C.ID_CATEGORIA WHERE ID_OFERTA = @Id_Oferta;
END;
GO

CREATE PROCEDURE PA_REGISTRAR_OFERTA(
@Codigo varchar(10),
@Nombre_Oferta varchar(50),
@Id_Producto int,
@Descripcion varchar(250),
@Fecha_Inicio datetime,
@Fecha_Fin datetime,
@Descuento int,
@Estado bit
)
AS
BEGIN
	INSERT INTO OFERTA(CODIGO, NOMBRE_OFERTA, ID_PRODUCTO, DESCRIPCION, FECHA_INICIO, FECHA_FIN, DESCUENTO, ESTADO) 
	values(@Codigo, @Nombre_Oferta, @Id_Producto, @Descripcion, @Fecha_Inicio, @Fecha_Fin, @Descuento, @Estado);
END;
GO

CREATE PROCEDURE PA_EDITAR_OFERTA(
@Id_Oferta int,
@Nombre_Oferta varchar(50),
@Id_Producto int,
@Descripcion varchar(250),
@Fecha_Inicio datetime,
@Fecha_Fin datetime,
@Descuento int,
@Estado bit
)
AS
BEGIN
	UPDATE OFERTA set NOMBRE_OFERTA = @Nombre_Oferta, ID_PRODUCTO = @Id_Producto, DESCRIPCION = @Descripcion, FECHA_INICIO = @Fecha_Inicio, FECHA_FIN = @Fecha_Fin, DESCUENTO = @Descuento, ESTADO = @Estado WHERE ID_OFERTA = @Id_Oferta;
END;
GO

CREATE PROCEDURE PA_ELIMINAR_OFERTA(
@Id_Oferta int
)
AS
BEGIN
	DELETE FROM OFERTA WHERE ID_OFERTA = @Id_Oferta;
END;
