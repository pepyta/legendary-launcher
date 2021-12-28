import DownloadManager from "@lib/legendary/DownloadManager";
import { Pause as PauseIcon } from "@mui/icons-material";
import { Button, DialogContent, DialogTitle, Grid, IconButton, LinearProgress, Skeleton, Typography } from "@mui/material";
import { Fragment } from "react";
import { useAppSelector } from "renderer/redux/hooks";

const DownloadInfo = () => {
    const { inProgress, progress, disk, network } = useAppSelector(({ downloadManager }) => downloadManager);

    const pause = () => {
        DownloadManager.pause();
    };

    if (!inProgress) {
        return (
            <Fragment>
                <DialogTitle>
                    Download manager
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant={"body1"}>
                                There is no download in progress!
                            </Typography>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Fragment>
        );
    }

    return (
        <DialogContent>

            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography variant={"h6"} gutterBottom>
                        {inProgress.app.app_title}

                        <Button
                            variant={"contained"}
                            startIcon={<PauseIcon />}
                            onClick={() => pause()}
                            sx={{
                                float: "right",
                            }}
                        >
                            Pause  
                        </Button>
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant={"caption"} textAlign={"right"}>
                        {
                            progress?.percent ?
                                `${progress.percent} %` :
                                <Skeleton />
                        }
                    </Typography>
                    {progress?.percent ? (
                        <LinearProgress variant="determinate" value={progress.percent} />
                    ) : (
                        <LinearProgress variant="indeterminate" />
                    )}
                </Grid>
                <Grid item xs={6}>
                    <Typography>
                        Time elapsed:
                    </Typography>
                    <Typography>
                        {progress?.elapsed || <Skeleton />}
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography>
                        Time remaining:
                    </Typography>
                    <Typography>
                        {progress?.eta || <Skeleton />}
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography>
                        Download speed:
                    </Typography>
                    <Typography>
                        {network?.decompressed || <Skeleton />}
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography>
                        Read:
                    </Typography>
                    <Typography>
                        {disk?.read || <Skeleton />}
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography>
                        Write:
                    </Typography>
                    <Typography>
                        {disk?.write || <Skeleton />}
                    </Typography>
                </Grid>
            </Grid>
        </DialogContent>
    );
};

export default DownloadInfo;