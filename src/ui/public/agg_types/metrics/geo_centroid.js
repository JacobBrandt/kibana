define(function (require) {
  return function AggTypeMetricGeoCentroidProvider(Private) {
    let MetricAggType = Private(require('ui/agg_types/metrics/MetricAggType'));

    return new MetricAggType({
      name: 'geo_centroid',
      title: 'Geo Centroid',
      makeLabel: function () {
        return 'Geo Centroid';
      },
      params: [
        {
          name: 'field',
          filterFieldTypes: 'geo_point'
        }
      ]
    });
  };
});
