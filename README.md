## Proyecto base en Webpack, Babel, SCSS y JavaScript ##

Este repositorio sirve como base para iniciar un proyecto con:
- Webpack (empaquetador de módulos)
- Babel (transcompilador de JavaScript moderno)
- SCSS (lenguaje de estilos)
- VanillaJS (JavaScript puro, sin frameworks -al menos, en el momento inicial-)

### Instrucciones de instalación ###

Antes de iniciar el proceso de instalación del proyecto, es necesario tener instalado en el ordenador [NodeJS (y NPM)](https://nodejs.org/es/) para poder trabajar con el entorno servidor de JavaScript.

Posteriormente, se debe clonar este repositorio en cualquier carpeta de su entorno (por ejemplo, en el escritorio). Una vez hecho esto, se debe ejecutar el comando **npm install** para disponer de todos los paquetes y librerías instalados de forma previa en el proyecto.

### Instrucciones para pruebas y despliegue ###

Para la realización de pruebas se ejecuta el comando **npm run start** que interpretará la configuración del archivo *webpack.dev.js*.

Para llevar a producción el proyecto se debe ejecutar el siguiente comando:
- **npm run build** > Que minifica los archivos .css y .js y hace menos pesado el proyecto

Tanto para trabajar en desarrollo como para llevar el proyecto a producción hay múltiples configuraciones, loaders y plugins posibles. Es cuestión de ver documentación de Webpack e interpretar qué es lo que más le conviene al proyecto.

### Estructuración del proyecto base ###

El proyecto base puede ser dividido en dos ámbitos: el primero, de *puro desarrollo*, lo conforman las subcarpetas **common_projects_utilities** (que contiene funciones y estilos utilizados en diversos proyectos y que se podrán reutilizar para trabajar con otros archivos de ***proyecto_pre***), el mencionado **proyecto_pre** (con la que se trabajará en desarrollo) y **proyecto_pro** (que creará Webpack una vez se lleve el proyecto a producción). 

El segundo apartado será de *configuración* y lo conforman los archivos: package.json, package-lock.json, webpack.common.js, webpack.dev.js, webpack.prod.js, README.md, .gitignore y la carpeta node_modules.

*(Por supuesto, una vez clonado el proyecto base, el desarrollador puede hacer y deshacer a su gusto en su proyecto especifíco)*

A continuación, se ofece una explicación más detallada de las funciones de cada archivo/carpeta:

**Carpeta de reutilización de código (common_projects_utilities)**

En esta carpeta se encuentran diversas funciones de JavaScript y librerías y estilos de CSS que se suelen utilizar en numerosos proyectos.

Por este motivo, todas aquellas funciones y estilos (u otros elementos como imágenes, por ejemplo) que puedan ser objeto de reutilización, se dispondrán en esta carpeta.

**Carpeta del proyecto en desarrollo (proyecto_pre)**

Es la carpeta donde se realiza todo el desarrollo del código del futuro especial. Aquí se encuentran el archivo .html y las subcarpetas css y js, que contendrán los estilos y la lógica del proyecto. No será necesario incluir los archivos .css y .js en el HTML: Webpack lo hará por nosotros una vez ejecutemos el comando **npm run start**.

**Carpeta de producción (proyecto_pro)**

Cuando el desarrollador considere oportuno subir el proyecto a producción deberá ejecutar **npm run build**.

En ese momento, Webpack creará la carpeta **proyecto_pro** con tres archivos en su interior: un index.html, un main.[hash].css y un main.[hash].js. Si lo ha ejecutado en modo 'production', los archivos se mostrarán minificados.

En función del tipo de proyecto, el desarrollador tendrá que enviar los tres archivos a un .zip o, en su defecto, tendrá subir los archivos .css y .js al CMS y ubicar en las etiquetas 'link' y 'script' las URLs correspondiente y enviar el archivo .html al .zip.

**webpack.common.js**

Este archivo contiene la configuración común de Webpack, Babel y otros loaders y plugins para los entornos de desarrollo y producción.

**webpack.dev.js**

El archivo con el que trabajaremos en local. Contiene la configuración específica para trabajar en desarrollo.

**webpack.prod.js**

Este archivo contiene las configuraciones necesarias para llevar el proyecto a producción (y crear la carpeta *proyecto_pro*).

**package.json**

Este archivo funciona como informador del proyecto. En él se establece la versión, los autores, el repositorio remoto de Bitbucket o las librerías instaladas, por ejemplo.

Del mismo modo, se pueden incluir scripts para ejecutar funciones de Webpack, Babel u otras librerías. En la actualidad sólo cuenta con uno (build > npm run build) para ejecutar comandos de Webpack.

**package-lock.json**

Archivo que informa con mayor detalle de todas las librerías instaladas para el proyecto.

**.gitignore**

Archivo que permite a Git (en este caso, a Bitbucket) ignorar la subida a remoto de determinados archivos o carpetas.

**node_modules/**

Carpeta que sirve de 'almacén' para todo el código de las librerías instaladas en el proyecto.

### Elementos fundamentales de la configuración inicial ###

En un primer momento se debe ejecutar en consola el comando **npm init -y** para crear el archivo package.json. A partir de ahí, el proyecto sabe que podrá servirse de NPM para instalar librerías de NodeJS y JavaScript.

Tras ello, se instalan los paquetes necesarios para trabajar con Webpack y Babel:

- npm i --save-dev webpack webpack-cli webpack-dev-server html-webpack-plugin
- npm i --save-dev babel-loader babel-cli @babel/core @babel/preset-env

*Una vez realizado el build del proyecto para llevarlo a producción (en nuestro caso, para luego llevar los archivos necesarios a un .zip), el puglin **html-webpack-plugin** permitirá generar de forma automática las etiquetas **link** y **script** con los archivos .css y .js correspondientes en el archivo .html.*

*Por defecto, Babel no traspila código que sea entendible por el 100% de los navegadores. Por este motivo, necesitamos echar mano de la [browserslist](https://github.com/browserslist/browserslist) y especificar a qué navegadores deseamos llegar como mínimo.*

*En nuestro caso, indicaremos que se pueda visualizar nuestro código en aquellos navegadores con una cuota de uso mayor al 0,25%. La consulta la incluiremos en nuestro archivo package.json*

Por último, se crearán tres archivos de configuración de Webpack: *webpack.dev.js* (que contendrá parámetros específicos para trabajar en preproducción), *webpack.prod.js* (parámetros a la hora de llevar a producción el proyecto) y *webpack.common.js* (parámetros comunes a los dos archivos anteriores).

(No es necesario crear el archivo *.babelrc* porque la configuración de Babel la integraremos dentro del archivo *webpack.common.js*)

Tras la configuración inicial, el proyecto requerirá de más loaders y plugins. Por ejemplo:

- npm i --save-dev html-loader style-loader css-loader sass-loader node-sass 
- npm i --save-dev clean-webpack-plugin mini-css-extract-plugin webpack-merge