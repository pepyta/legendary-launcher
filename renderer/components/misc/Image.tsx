import { Skeleton } from "@mui/material";
import { ComponentProps, Fragment, useState } from "react";

export type ImageProps = ComponentProps<"img">;

const Image = (props: ImageProps) => {
    const [loaded, setLoaded] = useState(false);

    return (
        <Fragment>
            <img
                {...props}
                loading={"lazy"}
                onLoad={() => setLoaded(true)}
                style={{
                    transition: "opacity .4s ease-in-out",
                    opacity: loaded ? 1 : 0,
                    ...props.style,
                }}    
            />
        </Fragment>
    );
};

export default Image;