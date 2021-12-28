import Image from "@components/misc/Image";
import DownloadManager from "@lib/legendary/DownloadManager";
import { DeleteRounded as DeleteIcon, Download as DownloadIcon, PlayArrowRounded, RemoveRounded as RemoveIcon } from "@mui/icons-material";
import { DialogContent, Grid, IconButton, Tooltip, Typography, useTheme } from "@mui/material";
import { Fragment } from "react";
import { useAppSelector } from "renderer/redux/hooks";

const DownloadQueue = () => {
    const { queue, inProgress } = useAppSelector(state => state.downloadManager);
    const theme = useTheme();

    if (queue.length === 0) return (
        <Fragment />
    );

    return (
        <DialogContent>
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <Typography variant={"body1"}>
                        Download queue
                    </Typography>
                </Grid>
                {queue.map((el) => (
                    <Grid item xs={12}>
                        <Grid container spacing={2} alignItems={"center"}>
                            <Grid item xs={1}>
                                <Image
                                    src={el.app.metadata.keyImages.find((el) => el.type === "DieselGameBoxTall").url}
                                    style={{
                                        maxWidth: "100%",
                                        boxShadow: theme.shadows[12],
                                        borderRadius: theme.shape.borderRadius,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={8}>
                                {el.app.app_title}
                            </Grid>
                            <Grid item xs={3} textAlign={"right"}>
                                <Tooltip title={"Download now"}>
                                    <IconButton onClick={() => DownloadManager.enqueue(el)}>
                                        <DownloadIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title={"Remove from queue"}>
                                    <IconButton onClick={() => DownloadManager.remove(el)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                        </Grid>
                    </Grid>
                ))}
            </Grid>
        </DialogContent>
    );
};

export default DownloadQueue;