import produce from "immer";

interface CyclesState {
    cycles: Cycle[];
    activeCycleId: string | null;
}

export interface Cycle {
    id: string;
    task: string;
    minutesAmount: number;
    startDate: Date;
    interuptedDate?: Date;
    finishedDate?: Date;
}

export function cyclesReducer(state: CyclesState, action: any) {
    switch (action.type) {
        case 'ADD_NEW_CYCLE':
            // return {
            //     ...state,
            //     cycles: [...state.cycles, action.payload.newCycle],
            //     activeCycleId: action.payload.newCycle.id
            // }
            return produce(state, draft => {
                draft.cycles.push(action.payload.newCycle);
                draft.activeCycleId = action.payload.newCycle.id;
            })
        case 'INTERUPT_CURRENT_CYCLE':
            // return {
            //     ...state,
            //     cycles: state.cycles.map(cycle => {
            //         if (cycle.id === state.activeCycleId) {
            //             return { ...cycle, interuptedDate: new Date() }
            //         } else {
            //             return cycle
            //         }
            //     }),
            //     activeCycleId: null
            // }
            const currentCycleIndex = state.cycles.findIndex(cycle => {
                return cycle.id === state.activeCycleId;
            });
            if (currentCycleIndex < 0) {
                return state;
            }
            return produce(state, draft => {
                draft.activeCycleId = null;
                draft.cycles[currentCycleIndex].interuptedDate = new Date();
            })
        case 'MARK_CURRENT_CYCLE_AS_FINISHED':
            // return {
            //     ...state,
            //     cycles: state.cycles.map(cycle => {
            //         if (cycle.id === state.activeCycleId) {
            //             return { ...cycle, finishedDate: new Date() }
            //         } else {
            //             return cycle
            //         }
            //     }),
            //     activeCycleId: null
            // }
            const currentCycleIndex2 = state.cycles.findIndex(cycle => {
                return cycle.id === state.activeCycleId;
            });
            if (currentCycleIndex2 < 0) {
                return state;
            }
            return produce(state, draft => {
                draft.activeCycleId = null;
                draft.cycles[currentCycleIndex2].finishedDate = new Date();
            })
        default:
            return state
    }
}