import { useReducer, createContext, useEffect } from 'react';
import clientAxios from '../utils/axios';

const initialState = {
    user: null,
}

const Context = createContext();

const rootReducer = (state, action) => {
    switch(action.type) {
        case "LOGIN":
            return { ...state, user: action.payload }

        case "LOGOUT":
            return { ...state, user: null }

        default:
            return state;
    }
}

const Provider = ({children}) => {
    const [state, dispatch] = useReducer(rootReducer, initialState);

    useEffect(() => {
        const userLocalStorage = localStorage.getItem('user');
        
        if (userLocalStorage) {
            dispatch({
                type: "LOGIN",
                payload: JSON.parse(userLocalStorage)
            });
            getCsrfToken();
        }
    }, []);

    const getCsrfToken = async () => {
        const { data } = await clientAxios.get('/api/csrf-token');
        clientAxios.defaults.headers["X-CSRF-Token"] = data.getCsrfToken;
        clientAxios.defaults.headers["x-token"] = localStorage.getItem('token');
    }

    return (
        <Context.Provider value={{state, dispatch}}>
            {children}
        </Context.Provider>
    )
    
}

export {Context, Provider};
