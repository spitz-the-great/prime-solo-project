import { put, call, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

function* fetchProfile() {

    try {
        console.log(' in get profile - saga')
        const profileResponse = yield call(axios.get, '/api/person/profile');
        const responseAction = { type: 'SET_PROFILE', payload: profileResponse.data };
        yield put(responseAction);
    }
    catch (error) {
        console.log('error in fetchProfile saga - profilePage.js', error);
        alert('unable to get profile data, saga');
    }
}

function* profileSaga() {
    console.log('in fetch profile');
    yield takeLatest('FETCH_PROFILE', fetchProfile)
}

export default profileSaga;