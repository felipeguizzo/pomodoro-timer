import { createContext, ReactNode, useReducer, useState } from "react";

interface Cycle {
    id: string;
    task: string;
    minutesAmount: number;
    startDate: Date;
    interuptedDate?: Date;
    finishedDate?: Date;
}

interface CyclesContextType {
    cycles: Cycle[];
    activeCycle: Cycle | undefined;
    activeCycleId: string | null;
    markCurrentCycleAsFinished: () => void;
    amountSecondsPassed: number;
    setSecondsPassed: (second: number) => void;
    createNewCycle: (data: CreateCycleData) => void;
    interuptCurrentCycle: () => void;
}

interface CreateCycleData {
    task: string;
    minutesAmount: number;
}

interface CyclesContextProviderProps {
    children: ReactNode;
}

export const CyclesContext = createContext({} as CyclesContextType);

export function CyclesContextProvider({ children }: CyclesContextProviderProps) {
    // const [cycles, setCycles] = useState<Cycle[]>([]);
    const [cycles, dispatch] = useReducer((state: Cycle[], action: any) => {
        if (action.type === "ADD_NEW_CYCLE") {
            return [...state, action.payload.newCycle]
        }
        return state
    }, []);
    const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);
    const [activeCycleId, setActiveCycleId] = useState<string | null>(null);

    const activeCycle = cycles.find(cycle => cycle.id === activeCycleId);

    function markCurrentCycleAsFinished() {
        // setCycles(
        //     state => state.map(cycle => {
        //         if (cycle.id === activeCycleId) {
        //             return { ...cycle, finishedDate: new Date() }
        //         } else return cycle;
        //     })
        // )
        dispatch({
            type: 'MARK_CURRENT_CYCLE_AS_FINISHED',
            payload: {
                activeCycleId
            }
        });
    }

    function setSecondsPassed(seconds: number) {
        setAmountSecondsPassed(seconds)
    }

    function createNewCycle(data: CreateCycleData) {
        const newCycle: Cycle = {
            id: String(new Date().getTime()),
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date()
        }

        // setCycles(state => [...state, newCycle]);
        dispatch({
            type: 'ADD_NEW_CYCLE',
            payload: {
                newCycle
            }
        });
        setActiveCycleId(newCycle.id);
        setAmountSecondsPassed(0);
    }

    function interuptCurrentCycle() {
        // setCycles(
        //     state => state.map(cycle => {
        //         if (cycle.id === activeCycleId) {
        //             return { ...cycle, interuptedDate: new Date() }
        //         } else return cycle;
        //     }))
        dispatch({
            type: 'INTERUPT_CURRENT_CYCLE',
            payload: {
                activeCycleId
            }
        });
        setActiveCycleId(null);
    }

    return (
        <CyclesContext.Provider
            value={{
                cycles,
                activeCycle,
                activeCycleId,
                markCurrentCycleAsFinished,
                amountSecondsPassed,
                setSecondsPassed,
                createNewCycle,
                interuptCurrentCycle
            }}
        >
            {children}
        </CyclesContext.Provider>
    )
}