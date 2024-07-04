import { createContext, JSX, useContext, createEffect } from 'solid-js'
import { createStore } from 'solid-js/store'

const FamilyContext = createContext()

export function FamilyProvider(props: { children: number | boolean | Node | JSX.ArrayElement | (string & {}) | null | undefined }) {
    const [families, setFamilies] = createStore()

    createEffect(async () => {
        const response = await fetch('/api/families')
        const data = await response.json()
        setFamilies(data.data)
    })

    return (
        <FamilyContext.Provider value={families}>
            {props.children}
        </FamilyContext.Provider>
    )
}

export function useFamilies() {
    const context = useContext(FamilyContext)
    if (!context){
        throw new Error('useFamilies must be used within a FamilyProvider')
    }
    return context
}