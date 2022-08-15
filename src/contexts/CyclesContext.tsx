import { differenceInSeconds } from "date-fns";
import { createContext, ReactNode, useEffect, useReducer, useState } from "react";
import { addNewCycleAction, interuptCurrentCycleAction, markCurrentCycleAsFinishedAction } from "../reducers/cycles/actions";
import { cyclesReducer } from "../reducers/cycles/reducer";

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
    const [cyclesState, dispatch] = useReducer(cyclesReducer, {
        cycles: [],
        activeCycleId: null
    },
        () => {
            const storedStateAsJSON = localStorage.getItem('@ignite-timer:cycles-state-1.0.0',)
            if (storedStateAsJSON) {
                return JSON.parse(storedStateAsJSON)
            }
        }
    );

    const { cycles, activeCycleId } = cyclesState;
    const activeCycle = cycles.find(cycle => cycle.id === activeCycleId);

    const [amountSecondsPassed, setAmountSecondsPassed] = useState(() => {
        if (activeCycle) {
            return differenceInSeconds(new Date(), new Date(activeCycle.startDate))
        }
        return 0
    });

    function markCurrentCycleAsFinished() {
        dispatch(markCurrentCycleAsFinishedAction());
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

        dispatch(addNewCycleAction(newCycle));
        setAmountSecondsPassed(0);
    }

    function interuptCurrentCycle() {
        dispatch(interuptCurrentCycleAction());
    }

    useEffect(() => {
        const stateJSON = JSON.stringify(cyclesState);
        localStorage.setItem('@ignite-timer:cycles-state-1.0.0', stateJSON);
    }, [cyclesState])

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