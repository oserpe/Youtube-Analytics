# Trabajo Práctico Especial Youtube Analytics

## 72.41 - Base de Datos II - 2º cuatrimestre 2021

### Instituto Tecnológico de Buenos Aires

## Autores

- [Serpe, Octavio Javier](https://github.com/OctavioSerpe) - Legajo 60076
- [Rodríguez, Manuel Joaquín](https://github.com/rodriguezmanueljoaquin) - Legajo 60258
- [Arca, Gonzalo](https://github.com/gonzaloarca) - Legajo 60303

## Tabla de contenidos

- [Trabajo Práctico Especial Youtube Analytics](#trabajo-práctico-especial-youtube-analytics)
	- [72.41 - Base de Datos II - 2º cuatrimestre 2021](#7241---base-de-datos-ii---2º-cuatrimestre-2021)
		- [Instituto Tecnológico de Buenos Aires](#instituto-tecnológico-de-buenos-aires)
	- [Autores](#autores)
	- [Tabla de contenidos](#tabla-de-contenidos)
	- [Dependencias](#dependencias)
	- [Cómo compilar el proyecto](#cómo-compilar-el-proyecto)
	- [Cómo ejecutar el proyecto](#cómo-ejecutar-el-proyecto)
		- [Descargar imagenes de docker de bases de datos](#descargar-imagenes-de-docker-de-bases-de-datos)
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

- Node (v14.13.1)
- React
- express
- mongodb
- neo4j-driver
- @elastic/elasticsearch

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

### Descargar imagenes de docker de bases de datos

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

Luego, situandose la carpeta `Youtube-Analytics`, para iniciar la API (que correra en el directorio `http://localhost:5000/`) ejecutar entrar en el directorio `backend` y ejecutar el comando:

```bash
$ npm start
```

Para iniciar la pagina web, ejecutar el mismo comando pero en el directorio `frontend` ubicado dentro de `Youtube-Analytics`. Esta aplicacion correra por default en el directorio `http://localhost:3000/`.

```bash
$ npm start
```

## Carga de datos

Para fetchear nuevos videos o inicializar el proyecto con bases de datos vacias, desde la carpeta `backend` en `Youtube-Analytics` ejecutar:

```bash
$ npm run load
```

###  Queries ofrecidas por la API

Sea {{path}} la URL donde se sirve la API (por default es localhost:5000).

#### 1. Obtener politicos soportados por el proyecto
```
http://{{path}}/politicians
```

#### 2. Obtener canales soportados por el proyecto
```
http://{{path}}/channel-names
```

#### 3. Obtener tiempo destinado a un politico en cada canal
```
http://{{path}}/politician-time-per-channel/:politician?page=:page
```
Donde `politician` es uno de los politicos soportados por la api y se encuentra URL-encodeado.

#### 4. Obtener menciones de pares de politicos en un canal
```
http://{{path}}/politician-pairs-mentions/:channel_name?page=:page
```
Donde `channel_name` es uno de los canales soportados por la api y se encuentra URL-encodeado

#### 5. Obtener menciones de una query en los videos dentro de un rango de tiempo
```
http://{{path}}/mentions/:query?from=:from_date&to=:to_date
```
Donde `query` se encuentra URL-encodeado, `from_date` y `to_date` son fechas del formato `DD/MM/YYYY`.

#### 6. Obtener como es recibido un politico en cada canal
```
http://{{path}}/politician-likeness-per-channel/:politician?page=:page
```
Donde `politician` es uno de los politicos soportados por la api y se encuentra URL-encodeado.

#### 7. Obtener como evolucionaron las menciones de una query en cada canal solicitado, dentro de un rango de tiempo en intervalos diarios
```
http://{{path}}/mentions-evolution/:query?from=:from_date&to=:to_date&channels=:channel_names
```
Donde `query` se encuentra URL-encodeado, `from_date` y `to_date` son fechas del formato `DD/MM/YYYY` y `channel_names` es una lista URL-encodeada con los nombres de los canales separados por `,`.

#### 8. Obtener las menciones a cada partido politico dentro de los videos de un canal determinado
```
http://{{path}}/party-mentions/:channel_name
```
Donde `channel_name` es uno de los canales soportados por la api y se encuentra URL-encodeado
