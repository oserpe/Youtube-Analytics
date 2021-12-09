# YouTube Analytics

## 72.41 - Base de Datos II - 2º cuatrimestre 2021 - Final 9/12/2021

### Instituto Tecnológico de Buenos Aires

## Autores

- [Serpe, Octavio Javier](https://github.com/OctavioSerpe) - Legajo 60076
- [Rodríguez, Manuel Joaquín](https://github.com/rodriguezmanueljoaquin) - Legajo 60258
- [Arca, Gonzalo](https://github.com/gonzaloarca) - Legajo 60303

## Tabla de contenidos

- [Autores](#autores)
- [Tabla de contenidos](#tabla-de-contenidos)
- [Dependencias](#dependencias)
- [Cómo compilar el proyecto](#cómo-compilar-el-proyecto)
- [Cómo ejecutar el proyecto](#cómo-ejecutar-el-proyecto)
- [Descargar y ejecutar imágenes de Docker con datasets](#descargar-y-ejecutar-imagenes-de-docker-con-datasets)
- [Iniciar servidores de Node y React](#iniciar-servidores-de-node-y-react)
- [Cómo modificar el puerto de la API](#cómo-modificar-el-puerto-de-la-api)
- [Carga de datos](#carga-de-datos)
- [Queries ofrecidas por la API](#queries-ofrecidas-por-la-api)
  - [1. Obtener politicos soportados por el proyecto](#1-obtener-politicos-soportados-por-el-proyecto)
  - [2. Obtener canales soportados por el proyecto](#2-obtener-canales-soportados-por-el-proyecto)
  - [3. Obtener tiempo destinado a un politico en cada canal](#3-obtener-tiempo-destinado-a-un-politico-en-cada-canal)
  - [4. Obtener menciones de pares de politicos en un canal](#4-obtener-menciones-de-pares-de-politicos-en-un-canal)
  - [5. Obtener menciones de una query en los videos dentro de un rango de tiempo](#5-obtener-menciones-de-una-query-en-los-videos-dentro-de-un-rango-de-tiempo)
  - [6. Obtener como es recibido un politico en cada canal](#6-obtener-como-es-recibido-un-politico-en-cada-canal)
  - [7. Obtener como evolucionaron las menciones de una query en cada canal solicitado, dentro de un rango de tiempo en intervalos diarios](#7-obtener-como-evolucionaron-las-menciones-de-una-query-en-cada-canal-solicitado-dentro-de-un-rango-de-tiempo-en-intervalos-diarios)
  - [8. Obtener las menciones a cada partido politico dentro de los videos de un canal determinado](#8-obtener-las-menciones-a-cada-partido-politico-dentro-de-los-videos-de-un-canal-determinado)

## Dependencias

- Node (probado con v14.13.1)
- NPM (probado con v6.14.8)
- Docker

### Dependencias de Node

Para consultar las dependencias de Node, revisar los archivos `package.json` que se encuentran en los directorios `frontend` y `backend`

## Cómo compilar el proyecto

Para instalar las dependencias que permiten el funcionamiento de la API, desde `backend` en la carpeta `Youtube-Analytics`, ejecutar el comando:

```bash
$ npm install
```

Analogamente, para la instalacion de las dependencias de la pagina realizar lo mismo en el directorio `frontend` ubicado dentro de `Youtube-Analytics`

```bash
$ npm install
```

## Cómo ejecutar el proyecto

### Descargar y ejecutar imagenes de Docker con datasets

Ejecutar los comandos:

```bash
$ docker run --name mongo -p 27017:27017 -d youtubeanalytics/dbs:latest
```

```bash
$ docker run --name neo -p7474:7474 -p7687:7687 -e NEO4J_AUTH=none youtubeanalytics/neo4j:latest
```

```bash
$ docker run --name elastic -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" youtubeanalytics/elasticsearch:latest
```

> NOTA: para detener los contenedores ejecutar desde la línea de comando: `docker stop [nombre_contenedor]`, y para volver a ejecutarlos correr `docker start [nombre_contenedor]`; donde `[nombre_contenedor]` puede ser `neo`, `mongo` o `elastic`, cada una para la respectiva base de datos utilizada en el proyecto.

### Iniciar servidores de Node y React

Luego, situandose la carpeta `Youtube-Analytics`, para iniciar la API (que correrá en el directorio `http://localhost:5001`) entrar en el directorio `backend` y ejecutar el comando:

```bash
$ npm start
```

Para iniciar la pagina web, ejecutar el mismo comando pero en el directorio `frontend` ubicado dentro de `Youtube-Analytics`. Esta aplicacion correra por default en el directorio `http://localhost:3000`.

```bash
$ npm start
```

Si todo funciona correctamente, deberá cargar la página adecuadamente y cada sección tendrá sus respectivas instrucciones sobre cómo ejecutar las queries desde el frontend.

### Cómo modificar el puerto de la API

Por defecto, la API correrá en el puerto `5001`. Si se desea modificar esto, habrá que modificar en los archivos `.env` y `.env.development` la propiedad `PORT` dentro del directorio `backend` para que su respectivo valor sea el que se desee. Para que el frontend registre el cambio en puerto, habrá que modificar el archivo `package.json` dentro del directorio `frontend`, modificando la propiedad `proxy` de la siguiente manera:

```json
...
"proxy": "http://localhost:[PUERTO_NUEVO]",
...
```

## Carga de datos

> ACLARACIÓN: Este paso no es necesario si ya se descargaron los datasets siguiendo los pasos en [Descargar y ejecutar imágenes de Docker con datasets](#descargar-y-ejecutar-imagenes-de-docker-con-datasets)

Para fetchear nuevos videos o inicializar el proyecto con bases de datos vacias, desde la carpeta `backend` en `Youtube-Analytics` ejecutar:

```bash
$ npm run load
```

Si se desea cargar sólo 1 de las bases, ejecutar desde `backend`:

```bash
$ npm run load-[base]
```

donde `[base]` puede ser `mongo`, `neo`, o `elastic`.

> ACLARACIÓN: `neo` depende de `elastic` y `elastic` depende de `mongo`, por lo cual si se corrieran en otro orden no se garantiza una ejecución correcta.

## Queries ofrecidas por la API

Sea `{{baseUrl}}` la URL donde se sirve la API (por default es `localhost:5001`).

Para acceder a la documentación completa de la API, la API expone un servicio de Swagger en `http://{{baseUrl}}/api-docs`

#### 1. Obtener politicos soportados por el proyecto

```
http://{{baseUrl}}/politicians
```

#### 2. Obtener canales soportados por el proyecto

```
http://{{baseUrl}}/channel-names
```

#### 3. Obtener tiempo destinado a un politico en cada canal

```
http://{{baseUrl}}/politician-time-per-channel/:politician?page=:page
```

Donde `politician` es uno de los politicos soportados por la api y se encuentra URL-encodeado.

#### 4. Obtener menciones de pares de politicos en un canal

```
http://{{baseUrl}}/politician-pairs-mentions/:channel_name?page=:page
```

Donde `channel_name` es uno de los canales soportados por la api y se encuentra URL-encodeado

#### 5. Obtener menciones de una query en los videos dentro de un rango de tiempo

```
http://{{baseUrl}}/mentions/:query?from=:from_date&to=:to_date
```

Donde `query` se encuentra URL-encodeado, `from_date` y `to_date` son fechas del formato `DD/MM/YYYY`.

#### 6. Obtener como es recibido un politico en cada canal

```
http://{{baseUrl}}/politician-likeness-per-channel/:politician?page=:page
```

Donde `politician` es uno de los politicos soportados por la api y se encuentra URL-encodeado.

#### 7. Obtener como evolucionaron las menciones de una query en cada canal solicitado, dentro de un rango de tiempo en intervalos diarios

```
http://{{baseUrl}}/mentions-evolution/:query?from=:from_date&to=:to_date&channels=:channel_names
```

Donde `query` se encuentra URL-encodeado, `from_date` y `to_date` son fechas del formato `DD/MM/YYYY` y `channel_names` es una lista URL-encodeada con los nombres de los canales separados por `,`.

#### 8. Obtener las menciones a cada partido politico dentro de los videos de un canal determinado

```
http://{{baseUrl}}/party-mentions/:channel_name
```

Donde `channel_name` es uno de los canales soportados por la api y se encuentra URL-encodeado
