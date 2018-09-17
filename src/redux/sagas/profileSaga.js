import { put, call, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

function* fetchProfile() {

    try {
        const profileResponse = yield call(axios.get, '/person/profile')
        const responseAction = { type: 'SET_PROFILE', payload: profileResponse.data };
        yield put(responseAction);
    }
    catch (error) {
        console.log('error in fetchProfile saga - profilePage.js', error);
        alert('unable to get profile data, saga');
    }
}




// function* fetchShelf() {
//     try {
//       const shelfResponse = yield call(axios.get, '/api/shelf')

//       const responseAction = { type: 'SET_SHELF', payload: shelfResponse.data };
//       yield put(responseAction);
//     }
//     catch (error) {
//       console.log('ERROR IN - getShelfSaga(); - index.js', error);
//       alert('unable to retrieve data');
//     }
//   }

function* profileSaga() {
    yield takeLatest('FETCH_PROFILE', fetchProfile)
}

export default profileSaga;