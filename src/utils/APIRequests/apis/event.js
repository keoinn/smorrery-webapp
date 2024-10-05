import request from '@/utils/APIRequests/requests.js'

export function fetchCadApi(date_min, date_max, dist_max) {
  return request({
    url: `cad.api?date-min=${date_min}&date-max=${date_max}&dist-max=${dist_max}`
  });
};

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