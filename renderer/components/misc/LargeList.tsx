import { useSnackbar } from "notistack";
import { Fragment, PropsWithChildren, useEffect, useMemo, useState } from "react";
import { enqueue } from "renderer/redux/download-manager";

export type LargeListProps = {
    children: JSX.Element[];
    iterationSize?: number;
    loader?: JSX.Element;
};

const LargeList = (props: LargeListProps) => {
    const iterationSize = useMemo(() => props.iterationSize || 12, [props.iterationSize]);
    const [state, setState] = useState<JSX.Element[]>(props.children.slice(0, iterationSize));

    useEffect(() => {
        setState(props.children.slice(0, iterationSize));
    }, [props.children]);

    useEffect(() => {
        if(state.length !== props.children.length) {
            const curr = Math.ceil(state.length / iterationSize);
            
            setTimeout(() => {
                setState(props.children.slice(0, (curr + 1) * iterationSize));
            }, 1000);
        }
    }, [state]);

    return (
        <Fragment>
            {state.map((el) => (
                el
            ))}
            {state.length !== props.children.length && props.loader}
        </Fragment>
    );
};

export default LargeList;