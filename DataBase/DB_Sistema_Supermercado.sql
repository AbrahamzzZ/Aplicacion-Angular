--Creacion de la base de datos
CREATE DATABASE Sistema_Supermercado; 
go

USE Sistema_Supermercado;
go

--Modulo Usuario Tabla-Procedimientos almacenados
CREATE TABLE USUARIO (ID_USUARIO int primary key identity,
CODIGO varchar(10),
NOMBRE_COMPLETO varchar(70),
CORREO_ELECTRONICO nvarchar(50),
CLAVE nvarchar(300),
ESTADO bit,
FECHA_CREACION datetime default getdate()
);
GO 

CREATE PROCEDURE PA_LISTA_USUARIO
AS
BEGIN
	SELECT ID_USUARIO, CODIGO, NOMBRE_COMPLETO, CLAVE, CORREO_ELECTRONICO, ESTADO, FECHA_CREACION FROM USUARIO;
END;
GO

CREATE PROCEDURE PA_OBTENER_USUARIO(
	@Id_Usuario int
)
AS
BEGIN
	SELECT ID_USUARIO, CODIGO, NOMBRE_COMPLETO, CLAVE, CORREO_ELECTRONICO, ESTADO, FECHA_CREACION FROM USUARIO
	WHERE ID_USUARIO = @Id_Usuario;
END;
GO

CREATE PROCEDURE PA_REGISTRAR_USUARIO(
@Codigo varchar(10),
@Nombre_Completo varchar(70),
@Correo_Electronico varchar(50),
@Clave nvarchar(300),
@Estado bit
)
AS
BEGIN
	INSERT INTO USUARIO(CODIGO, NOMBRE_COMPLETO, CLAVE, CORREO_ELECTRONICO, ESTADO) 
	values(@Codigo, @Nombre_Completo, @Clave, @Correo_Electronico, @Estado);
END;
GO

CREATE PROCEDURE PA_EDITAR_USUARIO(
@Id_Usuario int,
@Nombre_Completo varchar(70),
@Correo_Electronico varchar(50),
@Clave nvarchar(300),
@Estado bit
)
AS
BEGIN
	UPDATE USUARIO set NOMBRE_COMPLETO = @Nombre_Completo, CORREO_ELECTRONICO = @Correo_Electronico, CLAVE = @Clave, ESTADO = @Estado WHERE ID_USUARIO = @Id_Usuario;
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

--Modulo Producto Tabla-Procedimientos almacenados
CREATE TABLE PRODUCTO( ID_PRODUCTO int primary key identity,
CODIGO varchar(10),
DESCRIPCION nvarchar(50),
NOMBRE_PRODUCTO nvarchar(30),
CATEGORIA varchar(30),
PAIS_ORIGEN varchar(30),
STOCK int NOT NULL default 0,
PRECIO_VENTA decimal (10,2) default 0,
ESTADO bit,
);
GO

CREATE PROCEDURE PA_LISTA_PRODUCTO
AS
BEGIN
	SELECT ID_PRODUCTO, CODIGO, DESCRIPCION, NOMBRE_PRODUCTO, CATEGORIA, PAIS_ORIGEN, STOCK, PRECIO_VENTA, ESTADO FROM PRODUCTO;
END;
GO

CREATE PROCEDURE PA_OBTENER_PRODUCTO(
	@Id_Producto int
)
AS
BEGIN
	SELECT ID_PRODUCTO, CODIGO, DESCRIPCION, NOMBRE_PRODUCTO, CATEGORIA, PAIS_ORIGEN, STOCK, PRECIO_VENTA, ESTADO FROM PRODUCTO
	WHERE ID_PRODUCTO = @Id_Producto
END;
GO

CREATE PROCEDURE PA_REGISTRAR_PRODUCTO(
@Codigo varchar(10),
@Descripion nvarchar(50),
@Nombre_Producto varchar(30),
@Categoria varchar(30),
@Pais_Origen varchar(30),
@Stock int,
@Precio_Venta decimal (10,2),
@Estado bit
)
AS
BEGIN
	INSERT INTO PRODUCTO(CODIGO, DESCRIPCION, NOMBRE_PRODUCTO, CATEGORIA, PAIS_ORIGEN, STOCK, PRECIO_VENTA, ESTADO) 
	values(@Codigo, @Descripion, @Nombre_Producto, @Categoria, @Pais_Origen, @Stock, @Precio_Venta, @Estado);
END;
GO

CREATE PROCEDURE PA_EDITAR_PRODUCTO(
@Id_Producto int,
@Descripion nvarchar(50),
@Nombre_Producto varchar(30),
@Categoria varchar(30),
@Pais_Origen varchar(30),
@Stock int,
@Precio_Venta decimal (10,2),
@Estado bit
)
AS
BEGIN
	UPDATE PRODUCTO SET DESCRIPCION = @Descripion, NOMBRE_PRODUCTO = @Nombre_Producto, CATEGORIA = @Categoria, PAIS_ORIGEN = @Pais_Origen, STOCK = @Stock, PRECIO_VENTA = @Precio_Venta, ESTADO  = @Estado WHERE ID_PRODUCTO = @Id_Producto;
END;
GO

CREATE PROCEDURE PA_ELIMINAR_PRODUCTO(
@Id_Producto int
)
AS
BEGIN
	DELETE FROM PRODUCTO WHERE ID_PRODUCTO = @Id_Producto;
END;
