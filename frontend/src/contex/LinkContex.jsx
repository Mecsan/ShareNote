import { createContext, useReducer } from 'react'

export const LinkContex = createContext();

function LinkProvider(props) {

    let [links, dispatchLink] = useReducer((state, action) => {

        switch (action.type) {
            case "SET_LINK":
                return { links: action.payload };
            case "ADD_LINK":
                return { links: [...state.links, action.payload] };
            case "UP_LINK":
                return {
                    links: state.links.map((link) => {
                        if (link._id == action.key) {
                            return { ...link, ...action.payload }
                        }
                        return link;
                    })
                };
            case "DLT_LINK":
                return {
                    links: state.links.filter((link) => {
                        return link._id != action.key;
                    })
                }
            default:
                return state;
        }

    }, {
        links: null
    }
    )

    return (
        <LinkContex.Provider value={{ ...links, dispatchLink }}>
            {props.children}
        </LinkContex.Provider>
    )
}

export default LinkProvider
