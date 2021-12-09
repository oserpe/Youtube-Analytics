# Trabajo Práctico Especial Youtube Analytics

## 72.41 - Base de Datos II - 2º cuatrimestre 2021

### Instituto Tecnológico de Buenos Aires

## Autores

- [Serpe, Octavio Javier](https://github.com/OctavioSerpe) - Legajo 60076
- [Rodríguez, Manuel Joaquín](https://github.com/rodriguezmanueljoaquin) - Legajo 60258
- [Arca, Gonzalo](https://github.com/gonzaloarca) - Legajo 60303

## Tabla de contenidos

- [Dependencias](#dependencias)
- [Cómo compilar el proyecto](#cómo-compilar-el-proyecto)
- [Cómo ejecutar el proyecto](#cómo-ejecutar-el-proyecto)
  - [1. Queries API](#1-queries-api)
    - [1.1. /politicians](#11-politicians)
    - [1.2. /channel_names](#12-channel_names)
    - [1.3. /politician-time-per-channel](#13-politicians)
    - [1.4. /politician-pairs-mentions](#14-politician-pairs-mentions)
    - [1.5. /mentions](#15-mentions)
    - [1.6. /politicians-likeness-per-channel](#16-politicians-likeness-per-channel)
    - [1.7. /mentions-evolution](#17-mentions-evolution)
    - [1.8. /party-mentions](#18-party-mentions)

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

Desde la línea de comando, situado la carpeta `Youtube-Analytics`, para iniciar la API ejecutar entrar en el directorio `backend` y ejecutar el comando:

```bash
$ npm start
```

Para iniciar la pagina web, ejecutar el mismo comando pero en el directorio `frontend` ubicado dentro de `Youtube-Analytics`

```bash
$ npm start
```

## Carga de datos

Para fetchear nuevos videos, desde la carpeta `backend` en `Youtube-Analytics` ejecutar:

```bash
$ npm run load
```

### 1. Queries ofrecidas por la API

Sea {{path}} la URL donde se sirve la API (por default es localhost:5000).

#### 1.1 Obtener politicos soportados por el proyecto
```
http://{{path}}/politicians
```

#### 1.2 Obtener canales soportados por el proyecto
```
http://{{path}}/channel-names
```

#### 1.3 Obtener tiempo destinado a un politico en cada canal
```
http://{{path}}/politician-time-per-channel/:politician?page=:page
```
Donde `politician` es uno de los politicos soportados por la api y se encuentra URL-encodeado.

#### 1.4 Obtener menciones de pares de politicos en un canal
```
http://{{path}}/politician-pairs-mentions/:channel_name?page=:page
```
Donde `channel_name` es uno de los canales soportados por la api y se encuentra URL-encodeado

#### 1.5 Obtener menciones de una query en los videos dentro de un rango de tiempo
```
http://{{path}}/mentions/:query?from=:from_date&to=:to_date
```
Donde `query` se encuentra URL-encodeado, `from_date` y `to_date` son fechas del formato `DD/MM/YYYY`.

#### 1.6 Obtener como es recibido un politico en cada canal
```
http://{{path}}/politician-likeness-per-channel/:politician?page=:page
```
Donde `politician` es uno de los politicos soportados por la api y se encuentra URL-encodeado.

#### 1.7 Obtener como evolucionaron las menciones de una query en cada canal solicitado, dentro de un rango de tiempo en intervalos diarios
```
http://{{path}}/mentions-evolution/:query?from=:from_date&to=:to_date&channels=:channel_names
```
Donde `query` se encuentra URL-encodeado, `from_date` y `to_date` son fechas del formato `DD/MM/YYYY` y `channel_names` es una lista URL-encodeada con los nombres de los canales separados por `,`.

#### 1.8 Obtener las menciones a cada partido politico dentro de los videos de un canal determinado
```
http://{{path}}/party-mentions/:channel_name
```
Donde `channel_name` es uno de los canales soportados por la api y se encuentra URL-encodeado
