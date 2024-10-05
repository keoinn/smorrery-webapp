import request from '@/utils/APIRequests/requests.js'

// Close-Approach (CAD) API from NASA JPL
// https://ssd-api.jpl.nasa.gov/doc/cad.html
export function fetchCadApi(date_min, date_max, dist_max) {
  return request({
    url: `cad.api?date-min=${date_min}&date-max=${date_max}&dist-max=${dist_max}`
  });
};

// Small-Body Database (SBDB) API from NASA JPL
// https://ssd-api.jpl.nasa.gov/doc/sbdb.html
export function fetchSbdbApi(limit = 20) {
  return request({
    url: 'sbdb_query.api',
    params: new URLSearchParams({
      fields: 'full_name,epoch,e,a,q,i,om,w,ma',
      'sb-group': 'neo',
      limit: limit
    })
  });
}
