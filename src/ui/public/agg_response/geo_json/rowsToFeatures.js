define(function (require) {
  let decodeGeoHash = require('ui/utils/decode_geo_hash');
  let AggConfigResult = require('ui/Vis/AggConfigResult');
  let _ = require('lodash');

  function getAcr(val) {
    return val instanceof AggConfigResult ? val : null;
  }

  function unwrap(val) {
    return getAcr(val) ? val.value : val;
  }

  function convertRowsToFeatures(table, geoI, metricI, centroidI) {
    return _.transform(table.rows, function (features, row) {
      let geohash = unwrap(row[geoI]);
      if (!geohash) return;

      // fetch latLn of northwest and southeast corners, and center point
      let location = decodeGeoHash(geohash);

      let centerLatLng = [
        location.latitude[2],
        location.longitude[2]
      ];

      // fetch geo centroid and use it as point of feature if it exists
      let point = centerLatLng;
      let centroid = unwrap(row[centroidI]);
      if (centroid) {
        point = [
          centroid.lat,
          centroid.lon
        ];
      }

      // order is nw, ne, se, sw
      let rectangle = [
        [location.latitude[0], location.longitude[0]],
        [location.latitude[0], location.longitude[1]],
        [location.latitude[1], location.longitude[1]],
        [location.latitude[1], location.longitude[0]],
      ];

      // geoJson coords use LngLat, so we reverse the centerLatLng
      // See here for details: http://geojson.org/geojson-spec.html#positions
      features.push({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: point.slice(0).reverse()
        },
        properties: {
          geohash: geohash,
          value: unwrap(row[metricI]),
          aggConfigResult: getAcr(row[metricI]),
          // Please remember that this is the center of the geohash or
          // rectangle property.  It should not be considered the center of the
          // feature.  Use the geometry coordinates for that.
          center: centerLatLng,
          rectangle: rectangle,
          centroid: centroid
        }
      });
    }, []);
  }

  return convertRowsToFeatures;
});
