import axios from 'axios';
import Constant from '../Constant';

export const getStudentByUsername = username => {
    return axios.get(Constant.API_URL + '/api/resources/get-profile-by-param/?slug=' + username);
}

export const getStudentLessons = studentID => {
    return axios.get(Constant.API_URL + '/api/resources/teaching-lessons/?studentID=' + studentID);
}

export const getTeacherFeedbacks = studentID => {
    return axios.get(Constant.API_URL + '/api/resources/teacher-feedbacks/?studentID=' + studentID);
}

export const getStudentCourses = studentID => {
    return axios.get(Constant.API_URL + '/api/learning/courses/?studentID=' + studentID);
}