
const profileReducer = (state = [], action) => {
    console.log('in set profile - profile reducer')
    if (action.type === 'SET_PROFILE') {
        console.log('in set profile - profile reducer is true')
        return action.payload;
    }
    
    return state
};

export default profileReducer;