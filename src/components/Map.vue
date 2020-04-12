<template>
  <div class="map">
    <h1>Map</h1>
    <p>Hello world</p>
  </div>
</template>

<script>
import { LMap, LTileLayer, LMarker } from 'vue2-leaflet';

export default {
  name: 'Map',
  componentes: {
    LMap,
    LTileLayer,
    LMarker
  }
};
</script>
