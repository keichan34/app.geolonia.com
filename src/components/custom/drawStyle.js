/**
 * All properties should have prefix `user_`.
 * See https://github.com/mapbox/mapbox-gl-draw/blob/master/docs/API.md
 */

const textColor = '#000000'
const textHaloColor = '#FFFFFF'
const backgroundColor = 'rgba(255, 0, 0, 0.4)'
const strokeColor = '#FFFFFF'

export default [
  {
    id: 'draw-polygon',
    type: 'fill',
    filter: ['all',
      ['==', '$type', 'Polygon'],
      ['==', 'meta', 'feature']
    ],
    paint: {
      'fill-color': ['string', ['get', 'user_fill'], backgroundColor],
      'fill-opacity': [
        'case',
        ['==', ['get', 'active'], 'true'], 1.0,
        ['number', ['get', 'user_fill-opacity'], 1.0],
      ],
      'fill-outline-color': ['string', ['get', 'user_stroke'], strokeColor],
    },
  },
  {
    id: 'draw-linestring',
    type: 'line',
    filter: ['all',
      ['==', '$type', 'LineString'],
      ['==', 'meta', 'feature']
    ],
    paint: {
      'line-width': ['number', ['get', 'user_stroke-width'], 2],
      'line-color': ['string', ['get', 'user_stroke'], backgroundColor],
      'line-opacity': 1.0,
    },
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
  },
  {
    id: 'draw-active-points',
    type: 'circle',
    filter: ['all',
      ['==', '$type', 'Point'],
      ['==', 'meta', 'feature']
    ],
    paint: {
      'circle-radius': [
        'case',
        ['==', 'small', ['get', 'user_marker-size']], 7,
        ['==', 'large', ['get', 'user_marker-size']], 13,
        9,
      ],
      'circle-color': ['string', ['get', 'user_marker-color'], backgroundColor],
      'circle-opacity': [
        'case',
        ['==', ['get', 'active'], 'true'], 1.0,
        ['number', ['get', 'user_fill-opacity'], 1.0],
      ],
      'circle-stroke-width': ['number', ['get', 'user_stroke-width'], 2],
      'circle-stroke-color': ['string', ['get', 'user_stroke'], strokeColor],
      'circle-stroke-opacity': ['number', ['get', 'user_stroke-opacity'], 1.0],
    },
  },
  {
    id: 'draw-linestring-symbol',
    type: 'symbol',
    filter: ['all',
      ['==', '$type', 'LineString'],
      ['==', 'meta', 'feature']
    ],
    paint: {
      'text-color': ['string', ['get', 'user_text-color'], textColor],
      'text-halo-color': ['string', ['get', 'user_text-halo-color'], textHaloColor],
      'text-halo-width': 1,
    },
    layout: {
      'symbol-placement': 'line',
      'text-field': [
        'case',
        ['==', ['get', 'active'], 'true'], '',
        ['==', ['get', 'active'], 'false'], ['get', 'user_title'],
        ''
      ],
      'text-font': ['Noto Sans Regular'],
      'text-size': 12,
      'text-max-width': 12,
      'text-allow-overlap': false,
    },
  },
  {
    id: 'draw-polygon-symbol',
    type: 'symbol',
    filter: ['all',
      ['==', '$type', 'Polygon'],
      ['==', 'meta', 'feature']
    ],
    paint: {
      'text-color': ['string', ['get', 'user_text-color'], textColor],
      'text-halo-color': ['string', ['get', 'user_text-halo-color'], textHaloColor],
      'text-halo-width': 1,
    },
    layout: {
      'text-field': [
        'case',
        ['==', ['get', 'active'], 'false'], ['get', 'user_title'],
        ''
      ],
      'text-font': ['Noto Sans Regular'],
      'text-size': 12,
      'text-max-width': 12,
      'text-offset': [0, 0],
      'text-allow-overlap': false,
    },
  },
  {
    id: 'draw-point-symbol',
    type: 'symbol',
    filter: ['all',
      ['==', '$type', 'Point'],
      ['==', 'meta', 'feature'],
      ['any', ['has', 'user_title'], ['has', 'user_marker-symbol']]
    ],
    paint: {
      'text-color': ['string', ['get', 'user_text-color'], textColor],
      'text-halo-color': ['string', ['get', 'user_text-halo-color'], textHaloColor],
      'text-halo-width': 1,
    },
    layout: {
      'icon-image': [
        'case',
        ['==', 'large', ['get', 'user_marker-size']], ['image', ['concat', ['get', 'user_marker-symbol'], '-15']],
        ['image', ['concat', ['get', 'user_marker-symbol'], '-11']]
      ],
      'text-field': ['get', 'user_title'],
      'text-font': ['Noto Sans Regular'],
      'text-size': 12,
      'text-anchor': 'top',
      'text-max-width': 12,
      'text-offset': [
        'case',
        ['==', 'small', ['get', 'user_marker-size']], ['literal', [0, 0.6]],
        ['==', 'large', ['get', 'user_marker-size']], ['literal', [0, 1.2]],
        ['literal', [0, 0.8]],
      ],
      'text-allow-overlap': false,
    },
  }
]
