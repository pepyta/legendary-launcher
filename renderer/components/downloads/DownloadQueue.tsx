import { IKeyImage } from "@lib/legendary/LegendaryLibrary";
import { DataGrid, GridRenderCellParams } from "@mui/x-data-grid";
import { Fragment } from "react";
import { useAppSelector } from "renderer/redux/hooks";

const columns = [
    {
        field: "image",
        headerName: "Image",
        renderCell: (params: GridRenderCellParams<IKeyImage>) => (
            <img
                style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                }}
                src={params.value.url}
                loading="lazy"
            />
        ),
    },
    {
        field: "name",
        headerName: "Name",
    },
    {
        field: "id",
        headerName: "ID",
    },
];

const DownloadQueue = () => {
    const { queue } = useAppSelector(state => state.downloadManager);

    if(queue.length === 0) return (
        <Fragment />
    );

    return (
        <div style={{ height: 300, width: '100%' }}>
            <DataGrid
                rows={
                    queue.map(({ app }) => {
                        return {
                            id: app.app_name,
                            name: app.app_title,
                            image: app.metadata.keyImages.find((el) => el.type == "DieselGameBoxTall"),
                        };
                    })
                }
                columns={columns}
            />
        </div>
    );
};

export default DownloadQueue;