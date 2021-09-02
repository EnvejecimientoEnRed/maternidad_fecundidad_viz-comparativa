# Visualización comparativa entre la edad media a la maternidad en el primer hijo y el indicador coyuntural de fecundidad

La **visualización** la puede encontrar (aquí)[https://carlosmunozdiazcsic.github.io/viz_maternidad_fecundidad/] en su versión española y (aquí)[] en su versión inglesa.

Los **datos** utilizados en esta visualización se han recopilado del INE y han sido procesados por el Laboratorio de Estadísticas Experimentales del CSIC, dando lugar a un archivo CSV que pueden encontrar (aquí)[https://github.com/CarlosMunozDiazCSIC/viz_maternidad_fecundidad/blob/main/data/data_nac_fec_2.csv].

La visualización se puede embeber de dos formas:

- Con alto dinámico (gracias a la librería PYMJS*):

```
<div id="viz_csic_1_2021"></div>
<script type="text/javascript" src="https://pym.nprapps.org/pym.v1.min.js"></script>
<script>
    var pymParent = new pym.Parent('viz_csic_1_2021', 'https://carlosmunozdiazcsic.github.io/viz_maternidad_fecundidad/', {});
</script>
```

- Con alto fijo**:

```
<iframe src="https://envejecimientoenred.github.io/evolucion_residencias_viz_1/" style="height:572px;width:100%;" title="Iframe Example">
</iframe>
```

\* Debe revisar que el CMS donde vaya a embeber la visualización se puede utilizar el código con PYMJS que aquí se incluye
\*\* El alto que aquí se dispone es un alto para versiones mobile con el objetivo de siempre mostrar la visualización en todos los dispositivos posibles

## LICENSE

(CC BY 4.0)[https://creativecommons.org/licenses/by/4.0/]