import request from '@/utils/APIRequests/requests.js'
import cad_json from '@/assets/mock_api/cad.json'
import sbd_json from '@/assets/mock_api/sbd.json'
// https://ssd-api.jpl.nasa.gov/doc/cad.html
console.log(cad_json)
export function fetchCadApi(date_min, date_max, dist_max) {
  // return request({
  //   url: `cad.api?date-min=${date_min}&date-max=${date_max}&dist-max=${dist_max}`
  // });
  return { data: cad_json}
};

// Small-Body Database (SBDB) API from NASA JPL
// https://ssd-api.jpl.nasa.gov/doc/sbdb.html
export function fetchSbdbApi(limit = 20) {
  // return request({
  //   url: 'sbdb_query.api',
  //   params: new URLSearchParams({
  //     fields: 'full_name,epoch,e,a,q,i,om,w,ma',
  //     'sb-group': 'neo',
  //     limit: limit
  //   })
  // });

  return { data: sbd_json }
}