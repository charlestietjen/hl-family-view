import { createSignal, createContext, JSX, useContext } from 'solid-js'

export const FamilyContext = createContext([[], {}])

export function FamilyProvider(props: { children: number | boolean | Node | JSX.ArrayElement | (string & {}) | null | undefined }) {
    const [families, setFamilies] = createSignal([]),
        entries = [
            families,
            {
                setFamilies(families: any) {
                    setFamilies(families)
                }
            }
        ]

    return (
        <FamilyContext.Provider value={entries}>
            {props.children}
        </FamilyContext.Provider>
    )
}

export function useFamilies() {
    return useContext(FamilyContext)
}