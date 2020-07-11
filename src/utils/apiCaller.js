import axios from 'axios';
import * as config from './../contants/Config';

export default function(method ='GET', body){
	return axios({
        method: method,
        url: `${config.API_URL}`,
        data: body
    }).catch(err => {
        console.log(err);
    });
};
