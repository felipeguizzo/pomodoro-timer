import { HandPalm, Play } from "phosphor-react";
import { useContext } from "react";
import { HomeContainer, StartCountdownButton, StopCountdownButton } from "./styles";
import { NewCycleForm } from "./NewCycleForm";
import { Countdown } from "./Countdown";
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { FormProvider, useForm } from "react-hook-form";
import { CyclesContext } from "../../contexts/CyclesContext";

const newCycleFormValidationSchema = zod.object({
    task: zod.string().min(1, 'Informe a tarefa'),
    minutesAmount: zod.number().min(5).max(60)
})

/** torna a tipagem automatica de acordo com o modelo da validation */
type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>;

export function Home() {
    const { createNewCycle, interuptCurrentCycle, activeCycle } = useContext(CyclesContext);

    const newCycleForm = useForm<NewCycleFormData>({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task: '',
            minutesAmount: 0
        }
    });

    const { handleSubmit, watch, reset } = newCycleForm;

    function handleCreateNewCycle(data: NewCycleFormData) {
        createNewCycle(data);
        reset()
    }

    const task = watch('task');
    const isSubmitDisabled = !task;

    return (
        <HomeContainer>
            <form onSubmit={handleSubmit(handleCreateNewCycle)}>
                <FormProvider {...newCycleForm}>
                    <NewCycleForm />
                </FormProvider>
                <Countdown />

                {activeCycle ? (
                    <StopCountdownButton type="button" onClick={interuptCurrentCycle}>
                        <HandPalm size={24} />
                        Interromper
                    </StopCountdownButton>
                ) : (
                    <StartCountdownButton disabled={isSubmitDisabled} type="submit">
                        <Play size={24} />
                        Começar
                    </StartCountdownButton>
                )}
            </form>
        </HomeContainer>
    )
}