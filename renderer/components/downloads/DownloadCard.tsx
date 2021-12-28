import { Dialog, ListItem, ListItemIcon, ListItemText, DialogTitle } from "@mui/material";
import { Fragment, useState } from "react";
import DownloadInfo from "./DownloadInfo";
import { Download as DownloadIcon } from "@mui/icons-material";
import DownloadQueue from "./DownloadQueue";

export type DownloadCardProps = {};

const DownloadCard = (props: DownloadCardProps) => {
    const [open, setOpen] = useState(false);
    return (
        <Fragment>
            <ListItem button onClick={() => setOpen(true)}>
                <ListItemIcon>
                    <DownloadIcon />
                </ListItemIcon>
                <ListItemText
                    primary={"Downloads"}
                />
            </ListItem>
            <Dialog
                maxWidth={"sm"}
                fullWidth
                open={open}
                onClose={() => setOpen(false)}
            >
                <DownloadInfo />
                <DownloadQueue />
            </Dialog>
        </Fragment>
    );
};

export default DownloadCard;