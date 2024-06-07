import { createSignal, createContext, JSX } from 'solid-js'

export const FamilyContext = createContext([[], {}])

export function FamilyProvider(props: { children: number | boolean | Node | JSX.ArrayElement | (string & {}) | null | undefined }) {
    const [families, setFamilies] = createSignal([])
    const entries = [
        families,
        {
            set(families: any) {
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