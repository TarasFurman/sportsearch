import axios from 'axios'
import qs from 'qs'

class SportSearchService {

    constructor()
    {
      this.filtersDictionary = {}
    }

    getEvents = () => {

    return axios.get('http://localhost:5999/get-events', {
        params:
        { "id": this.filtersDictionary["id"],
          "x1_coord" : this.filtersDictionary["x1_coord"],
          "x2_coord" : this.filtersDictionary["x2_coord"],
          "y1_coord" : this.filtersDictionary["y1_coord"],
          "y2_coord" : this.filtersDictionary["y2_coord"],
          "sport_ids" : this.filtersDictionary["sport_ids"],
          "age_from" : this.filtersDictionary["age_from"],
          "age_to" : this.filtersDictionary["age_to"],
          "price_free" : this.filtersDictionary["price_free"],
          "price_paid" : this.filtersDictionary["price_paid"],
          "members_from" : this.filtersDictionary["members_from"],
          "members_to" : this.filtersDictionary["members_to"],
          "end_time" : this.filtersDictionary["end_time"],
          "start_time" : this.filtersDictionary["start_time"]
        },
          paramsSerializer : (params) => {
            return qs.stringify(params, {arrayFormat: "repeat"})}
        })  
    }

    getAnotherUser = (another_user_id_int) => {
      return axios.post('http://localhost:5999/another-users-profile', // url
        {"another_user": another_user_id_int},// data json
        {headers: { "Content-type": "application/json"}, withCredentials: true }// config
        )
        .then((res) => {
          return res.data
      })
    }
}

export default SportSearchService;