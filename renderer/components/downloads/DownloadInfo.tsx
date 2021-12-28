import { DialogContent, Grid, LinearProgress, Skeleton, Typography } from "@mui/material";
import { useAppSelector } from "renderer/redux/hooks";

const DownloadInfo = () => {
    const { inProgress, progress, disk, network } = useAppSelector(({ downloadManager }) => downloadManager);

    if (!inProgress) {
        return (
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant={"body1"}>
                            There is no download in progress!
                        </Typography>
                    </Grid>
                </Grid>
            </DialogContent>
        );
    }

    return (

        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Typography variant={"body1"} gutterBottom>
                    {inProgress.app.app_title}
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
    );
};

export default DownloadInfo;