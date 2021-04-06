import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import AddToQueueIcon from "@material-ui/icons/AddToQueue";
import RemoveFromQueueIcon from "@material-ui/icons/RemoveFromQueue";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import Chip from "@material-ui/core/Chip";
import RadioButtonCheckedIcon from "@material-ui/icons/RadioButtonChecked";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";
import Typography from "@material-ui/core/Typography";
import MaterialTable, { MTableToolbar } from "@material-table/core";
import ErrorDialog from "./ErrorDialog";
import LoadingIndicator from "./LoadingIndicator";
import ContextMain from "./ContextMain";
import TextField from "@material-ui/core/TextField";
import SingleSelect from "./SingleSelect";
import MultipleSelect from "./MultipleSelect";
import axios from "axios";
import Tooltip from "@material-ui/core/Tooltip";
import Link from "@material-ui/core/Link";
import SwitchMultiWay from "./SwitchMultiWay";
import ToggleSwitch from "./ToggleSwitch";
import FilterListIcon from "@material-ui/icons/FilterList";
import ViewColumnIcon from "@material-ui/icons/ViewColumn";
import {
  baseUrl,
  mc_baseUrl,
  querySizeLimit,
  filterKGModelsKeys,
  filterModelDBKeys,
  modelDB_baseUrl,
  modelDB_viewUrl,
  corsProxy,
  osb_baseUrl,
} from "./globals";
import {
  formatAuthors,
  formatTimeStampToLongString,
  buildQuery,
  showNotification,
  formatLabel,
} from "./utils";

const labelsModelDBKeys = {
  regions: "Brain Region",
  celltypes: "Cell Type",
  modeltypes: "Model Type",
  modelconcepts: "Model Concept",
  simenvironments: "Simulator",
  implemented_by: "Implemented By",
  currents: "Currents",
  gap_junctions: "Gap Junctions",
  receptors: "Receptors",
  gene: "Gene",
  neurotransmitters: "Neurotransmitters",
  model_paper: "Model Paper",
  notes: "Notes",
  public_submitter_email: "Email",
  ver_date: "Date",
};

const filterAttributeMappingModelDB = {
  regions: "region",
  celltypes: "neurons",
  modeltypes: "model_type",
  modelconcepts: "model_concept",
  simenvironments: "modeling_application",
  implemented_by: "implemented_by",
  currents: "currents",
  gap_junctions: "gap_junctions",
  receptors: "receptors",
  gene: "gene",
  neurotransmitters: "neurotransmitters",
  model_paper: "model_paper",
  notes: "notes",
  public_submitter_email: "public_submitter_email",
  ver_date: "ver_date",
};

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon style={{ color: "#000000" }} />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

// define the columns for the material data table
const KG_TABLE_COLUMNS = [
  {
    field: "id",
    title: "ID",
    hidden: true,
  },
  {
    field: "name",
    title: "Name",
  },
  {
    field: "alias",
    title: "Alias",
    hidden: true,
  },
  {
    field: "author",
    title: "Author",
    render: (item) => formatAuthors(item.author),
  },
  {
    field: "private",
    title: "Visibility",
    render: (item) => (item.private ? "Private" : "Public"),
    hidden: true,
  },
  {
    field: "project_id",
    title: "Collab",
    hidden: true,
  },
  {
    field: "species",
    title: "Species",
    hidden: true,
  },
  {
    field: "brain_region",
    title: "Brain Region",
    hidden: true,
  },
  {
    field: "cell_type",
    title: "Cell Type",
    hidden: true,
  },
  {
    field: "model_scope",
    title: "Model Scope",
    hidden: true,
  },
  {
    field: "abstraction_level",
    title: "Abstraction Level",
    hidden: true,
  },
  {
    field: "owner",
    title: "Owner",
    render: (item) => formatAuthors(item.owner),
    hidden: true,
  },
  {
    field: "organization",
    title: "Organization",
    hidden: true,
  },
  {
    field: "date_created",
    title: "Created Date",
    hidden: true,
  },
];
const MODELDB_TABLE_COLUMNS = [
  {
    field: "id",
    title: "ID",
    width: 100,
  },
  {
    field: "name",
    title: "Name",
  },
  {
    field: "region",
    title: "Brain Region",
    hidden: true,
  },
  {
    field: "neurons",
    title: "Cell Type",
    hidden: true,
  },
  {
    field: "model_type",
    title: "Model Type",
  },
  {
    field: "model_concept",
    title: "Model Concept",
    hidden: true,
  },
  {
    field: "modeling_application",
    title: "Simulator",
  },
];
const OSB_TABLE_COLUMNS = [
  {
    field: "id",
    title: "ID",
    hidden: true,
  },
  {
    field: "identifier",
    title: "Identifier",
  },
  {
    field: "name",
    title: "Name",
  },
  {
    field: "species",
    title: "Species",
  },
  {
    field: "brain_region",
    title: "Brain Region",
  },
  {
    field: "cell_type",
    title: "Cell Type",
  },
  {
    field: "original_format",
    title: "Original Format",
    hidden: true,
  },
];

function IncludeButton(props) {
  //   console.log(props);
  if (props.includeFlag) {
    return (
      <Tooltip title="Remove model instance from collection" placement="top">
        <Button
          variant="contained"
          style={{
            backgroundColor: "#FF5722",
            border: "solid",
            borderColor: "#000000",
            borderWidth: "1px",
            width: "150px",
          }}
          startIcon={<RemoveFromQueueIcon />}
          onClick={() =>
            props.removeInstanceCollection(props.model_id, props.instance_id)
          }
        >
          Remove
        </Button>
      </Tooltip>
    );
  } else {
    return (
      <Tooltip title="Add model instance to collection" placement="top">
        <Button
          variant="contained"
          style={{
            backgroundColor: "#81C784",
            border: "solid",
            borderColor: "#000000",
            borderWidth: "1px",
            width: "150px",
          }}
          startIcon={<AddToQueueIcon />}
          onClick={() =>
            props.addInstanceCollection(
              props.model_id,
              props.model_name,
              props.instance_id,
              props.instance_name,
              props.source_url,
              props.view_url
            )
          }
        >
          Add
        </Button>
      </Tooltip>
    );
  }
}

function InstanceParameter(props) {
  return (
    <div style={{ width: "1000px" }}>
      <Grid container>
        <Grid item xs={9}>
          <Box
            component="div"
            bgcolor="white"
            overflow="scroll"
            border={1}
            borderColor="grey.500"
            borderRadius={10}
            style={{
              padding: 10,
              cursor: "pointer",
            }}
            whiteSpace="nowrap"
          >
            {props.value || ""}
          </Box>
        </Grid>
        {/* <Grid item xs={3}>
        <Box component="div" my={2}>
          <Button
            variant="contained"
            style={{
              textTransform: "none",
            }}
            //   onClick={() => doSomething(props.value)}
          >
            MyButton
          </Button>
        </Box>
      </Grid> */}
      </Grid>
    </div>
  );
}

class KGContentModelVersion extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedParam: "source",
    };
  }

  render() {
    return (
      <Box
        my={2}
        pb={0}
        style={{ backgroundColor: "#FFF1CC", marginBottom: "20px" }}
        key={this.props.instance.id}
      >
        <Grid
          container
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#FFD180",
          }}
        >
          <Grid item xs={6}>
            <Box px={2} display="flex" flexDirection="row">
              <p variant="subtitle2">
                Version:{" "}
                <span style={{ cursor: "pointer", fontWeight: "bold" }}>
                  {this.props.instance.version}
                </span>
              </p>
            </Box>
          </Grid>
          <Grid container item justify="flex-end" xs={6}>
            <Box
              px={2}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="body2" color="textSecondary">
                Model Instance ID: <span>{this.props.instance.id}</span>
              </Typography>
              <Typography
                variant="body2"
                style={{ color: "#000000", paddingLeft: "25px" }}
              >
                {formatTimeStampToLongString(this.props.instance.timestamp)}
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <Grid container spacing={3} alignItems="flex-end">
          <Grid item xs={9}>
            <div style={{ padding: "10px 0px 0px 10px" }}>
              <div>
                {[
                  "description",
                  "source",
                  "morphology",
                  "parameters",
                  "code_format",
                  "license",
                  "hash",
                ].map((param, ind) => (
                  <Chip
                    icon={
                      this.state.selectedParam === param ? (
                        <RadioButtonCheckedIcon />
                      ) : (
                        <RadioButtonUncheckedIcon />
                      )
                    }
                    key={ind}
                    label={param}
                    clickable
                    onClick={() => this.setState({ selectedParam: param })}
                    variant="outlined"
                    style={{
                      color: "#000000",
                      marginRight: "10px",
                      marginBottom: "10px",
                    }}
                  />
                ))}
              </div>
              <InstanceParameter
                label={"param"}
                value={this.props.instance[this.state.selectedParam]}
              />
            </div>
          </Grid>
          <Grid item xs={3} style={{ paddingBottom: "35px" }}>
            <IncludeButton
              includeFlag={this.props.checkInstanceInCollection(
                "KG_" + this.props.instance.model_id,
                this.props.instance.id
              )}
              model_id={"KG_" + this.props.model_id}
              model_name={this.props.model_name}
              instance_id={this.props.instance.id}
              instance_name={this.props.instance.version}
              source_url={this.props.instance.source}
              view_url={mc_baseUrl + "/#model_id." + this.props.model_id}
              addInstanceCollection={this.props.addInstanceCollection}
              removeInstanceCollection={this.props.removeInstanceCollection}
            />
          </Grid>
        </Grid>
      </Box>
    );
  }
}

class KGContentModelVersionsPanel extends React.Component {
  render() {
    // console.log(this.props);
    return (
      <Grid item style={{ backgroundColor: "#CFD8DC", padding: "20px" }}>
        <Grid container direction="row">
          <Grid
            item
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              verticalAlign: "middle",
            }}
          >
            <Typography variant="subtitle1">
              <b>Versions</b>
            </Typography>
            <Link
              href={mc_baseUrl + "/#model_id." + this.props.data.id}
              target="_blank"
              rel="noreferrer"
              underline="none"
            >
              <Button
                variant="contained"
                style={{ color: "#455A64" }}
                startIcon={<OpenInNewIcon />}
              >
                Open Model
              </Button>
            </Link>
          </Grid>
        </Grid>
        {this.props.data.instances.length === 0 ? (
          <div style={{ fontSize: 14 }}>
            <br />
            No model instances have yet been registered for this model.
          </div>
        ) : (
          this.props.data.instances.map((instance, ind) => (
            <div style={{ marginBottom: "25px" }} key={ind}>
              <KGContentModelVersion
                model_id={this.props.data.id}
                model_name={this.props.data.name}
                instance={instance}
                addInstanceCollection={this.props.addInstanceCollection}
                removeInstanceCollection={this.props.removeInstanceCollection}
                checkInstanceInCollection={this.props.checkInstanceInCollection}
              />
            </div>
          ))
        )}
      </Grid>
    );
  }
}

export class KGContent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedRows: [],
      filtering: false,
    };
  }

  render() {
    return (
      <div>
        <div
          style={{
            paddingBottom: "15px",
            display: "flex",
            alignItems: "center",
          }}
        >
          Please click on &nbsp; <ViewColumnIcon /> &nbsp; to hide/show other
          columns, and click on &nbsp; <FilterListIcon /> &nbsp; to filter the
          contents for each column.
        </div>
        <MaterialTable
          title={
            "Models (" +
            this.props.data.length +
            (this.props.data.length === 1 ? " entry)" : " entries)")
          }
          data={this.props.data}
          columns={KG_TABLE_COLUMNS}
          options={{
            columnsButton: true,
            search: true,
            paging: false,
            filtering: this.state.filtering,
            sorting: true,
            //   selection: true,
            exportButton: false,
            maxBodyHeight: "60vh",
            headerStyle: {
              position: "sticky",
              top: 0,
              backgroundColor: "#FFF",
              fontWeight: "bolder",
              fontSize: 15,
            },
            rowStyle: (rowData) => ({
              backgroundColor: this.state.selectedRows.includes(
                rowData.tableData.id
              )
                ? "#FFD180"
                : "#EEEEEE",
            }),
          }}
          actions={[
            {
              icon: "filter_list",
              onClick: () =>
                this.setState({ filtering: !this.state.filtering }),
              position: "toolbar",
              tooltip: "Show Filters",
            },
          ]}
          detailPanel={(rowData) => {
            return (
              <KGContentModelVersionsPanel
                data={rowData}
                addInstanceCollection={this.props.addInstanceCollection}
                removeInstanceCollection={this.props.removeInstanceCollection}
                checkInstanceInCollection={this.props.checkInstanceInCollection}
              />
            );
          }}
          onRowClick={(event, selectedRow, togglePanel) => {
            togglePanel();
          }}
          components={{
            Toolbar: (props) => (
              <div
                style={{
                  backgroundColor: "#FFD180",
                  fontWeight: "bolder !important",
                }}
              >
                <MTableToolbar {...props} />
              </div>
            ),
          }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            paddingLeft: "2.5%",
            paddingRight: "2.5%",
            paddingTop: "10px",
            width: "100%",
          }}
        >
          <h6>
            {"Number of model instances selected: " +
              this.props.countTotalInstances()}
          </h6>
        </div>
      </div>
    );
  }
}

class ModelDBContentModelPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedParam: "implemented_by",
    };
  }

  render() {
    // console.log(this.props);
    return (
      <Grid item style={{ backgroundColor: "#CFD8DC", padding: "20px" }}>
        <Grid container direction="row">
          <Grid
            item
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              verticalAlign: "middle",
            }}
          >
            <Typography variant="subtitle1">
              <b>Model Details:</b>
            </Typography>
            <Link
              href={
                modelDB_viewUrl +
                "/ShowModel.cshtml?model=" +
                this.props.data.id
              }
              target="_blank"
              rel="noreferrer"
              underline="none"
            >
              <Button
                variant="contained"
                style={{ color: "#455A64" }}
                startIcon={<OpenInNewIcon />}
              >
                Open Model
              </Button>
            </Link>
          </Grid>
        </Grid>
        <div style={{ marginBottom: "25px" }}>
          <Box
            my={2}
            pb={0}
            style={{ backgroundColor: "#FFF1CC", marginBottom: "20px" }}
          >
            <Grid
              container
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#FFD180",
              }}
            >
              <Grid item xs={6}>
                <Box px={2} display="flex" flexDirection="row">
                  <p variant="subtitle2">
                    Model ID:{" "}
                    <span style={{ cursor: "pointer", fontWeight: "bold" }}>
                      {this.props.data.id}
                    </span>
                  </p>
                </Box>
              </Grid>
            </Grid>
            <Grid container spacing={3} alignItems="flex-end">
              <Grid item xs={9}>
                <div style={{ padding: "10px 0px 0px 10px" }}>
                  <div>
                    {Object.entries(filterAttributeMappingModelDB).map(
                      ([key, param], ind) => (
                        <Chip
                          icon={
                            this.state.selectedParam === param ? (
                              <RadioButtonCheckedIcon />
                            ) : (
                              <RadioButtonUncheckedIcon />
                            )
                          }
                          key={ind}
                          label={labelsModelDBKeys[key]}
                          clickable
                          onClick={() =>
                            this.setState({ selectedParam: param })
                          }
                          variant="outlined"
                          style={{
                            color: "#000000",
                            marginRight: "10px",
                            marginBottom: "10px",
                          }}
                        />
                      )
                    )}
                  </div>
                  <InstanceParameter
                    label={"param"}
                    value={this.props.data[this.state.selectedParam]}
                  />
                </div>
              </Grid>
              <Grid item xs={3} style={{ paddingBottom: "35px" }}>
                <IncludeButton
                  includeFlag={this.props.checkInstanceInCollection(
                    "ModelDB_" + this.props.data.id,
                    "0"
                  )}
                  model_id={"ModelDB_" + this.props.data.id}
                  model_name={this.props.data.name}
                  instance_id={"0"}
                  instance_name={""}
                  source_url={
                    modelDB_viewUrl +
                    "/eavBinDown?o=" +
                    this.props.data.id +
                    "&a=23&mime=application/zip"
                  }
                  view_url={
                    modelDB_viewUrl +
                    "/ShowModel.cshtml?model=" +
                    this.props.data.id
                  }
                  addInstanceCollection={this.props.addInstanceCollection}
                  removeInstanceCollection={this.props.removeInstanceCollection}
                />
              </Grid>
            </Grid>
          </Box>
        </div>
      </Grid>
    );
  }
}

export class ModelDBContent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedRows: [],
      filtering: false,
    };
  }

  render() {
    console.log(this.props);
    return (
      <div>
        <div
          style={{
            paddingBottom: "15px",
            display: "flex",
            alignItems: "center",
          }}
        >
          Please click on &nbsp; <ViewColumnIcon /> &nbsp; to hide/show other
          columns, and click on &nbsp; <FilterListIcon /> &nbsp; to filter the
          contents for each column.
        </div>
        <MaterialTable
          title={
            "Models (" +
            this.props.data.length +
            (this.props.data.length === 1 ? " entry)" : " entries)")
          }
          data={this.props.data}
          columns={MODELDB_TABLE_COLUMNS}
          options={{
            columnsButton: true,
            search: true,
            paging: false,
            filtering: this.state.filtering,
            sorting: true,
            //   selection: true,
            exportButton: false,
            maxBodyHeight: "60vh",
            headerStyle: {
              position: "sticky",
              top: 0,
              backgroundColor: "#FFF",
              fontWeight: "bolder",
              fontSize: 15,
            },
            rowStyle: (rowData) => ({
              backgroundColor: this.state.selectedRows.includes(
                rowData.tableData.id
              )
                ? "#FFD180"
                : "#EEEEEE",
            }),
          }}
          actions={[
            {
              icon: "filter_list",
              onClick: () =>
                this.setState({ filtering: !this.state.filtering }),
              position: "toolbar",
              tooltip: "Show Filters",
            },
          ]}
          detailPanel={(rowData) => {
            return (
              <ModelDBContentModelPanel
                data={rowData}
                addInstanceCollection={this.props.addInstanceCollection}
                removeInstanceCollection={this.props.removeInstanceCollection}
                checkInstanceInCollection={this.props.checkInstanceInCollection}
              />
            );
          }}
          onRowClick={(event, selectedRow, togglePanel) => {
            togglePanel();
          }}
          components={{
            Toolbar: (props) => (
              <div
                style={{
                  backgroundColor: "#FFD180",
                  fontWeight: "bolder !important",
                }}
              >
                <MTableToolbar {...props} />
              </div>
            ),
          }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            paddingLeft: "2.5%",
            paddingRight: "2.5%",
            paddingTop: "10px",
            width: "100%",
          }}
        >
          <h6>
            {"Number of model instances selected: " +
              this.props.countTotalInstances()}
          </h6>
        </div>
      </div>
    );
  }
}

class OSBContentModelPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedParam: "name",
    };
  }

  render() {
    // console.log(this.props);
    return (
      <Grid item style={{ backgroundColor: "#CFD8DC", padding: "20px" }}>
        <Grid container direction="row">
          <Grid
            item
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              verticalAlign: "middle",
            }}
          >
            <Typography variant="subtitle1">
              <b>Model Details:</b>
            </Typography>
            <Link
              href={osb_baseUrl + "/projects/" + this.props.data.identifier}
              target="_blank"
              rel="noreferrer"
              underline="none"
            >
              <Button
                variant="contained"
                style={{ color: "#455A64" }}
                startIcon={<OpenInNewIcon />}
              >
                Open Model
              </Button>
            </Link>
          </Grid>
        </Grid>
        <div style={{ marginBottom: "25px" }}>
          <Box
            my={2}
            pb={0}
            style={{ backgroundColor: "#FFF1CC", marginBottom: "20px" }}
          >
            <Grid
              container
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#FFD180",
              }}
            >
              <Grid item xs={6}>
                <Box px={2} display="flex" flexDirection="row">
                  <p variant="subtitle2">
                    Model Identifier:{" "}
                    <span style={{ cursor: "pointer", fontWeight: "bold" }}>
                      {this.props.data.identifier}
                    </span>
                  </p>
                </Box>
              </Grid>
              <Grid container item justify="flex-end" xs={6}>
                <Box
                  px={2}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="body2" color="textSecondary">
                    Model ID: <span>{this.props.data.id}</span>
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            <Grid container spacing={3} alignItems="flex-end">
              <Grid item xs={9}>
                <div style={{ padding: "10px 0px 0px 10px" }}>
                  <div>
                    {[
                      "name",
                      "description",
                      "homepage",
                      "original_format",
                      "classification",
                      "family",
                      "species",
                      "brain_region",
                      "cell_type",
                      "created_on",
                      "updated_on",
                      "is_public",
                      "repository",
                    ].map((item, ind) => (
                      <Chip
                        icon={
                          this.state.selectedParam === item ? (
                            <RadioButtonCheckedIcon />
                          ) : (
                            <RadioButtonUncheckedIcon />
                          )
                        }
                        key={ind}
                        label={formatLabel(item)}
                        clickable
                        onClick={() => this.setState({ selectedParam: item })}
                        variant="outlined"
                        style={{
                          color: "#000000",
                          marginRight: "10px",
                          marginBottom: "10px",
                        }}
                      />
                    ))}
                  </div>
                  <InstanceParameter
                    label={"param"}
                    value={this.props.data[this.state.selectedParam]}
                  />
                </div>
              </Grid>
              <Grid item xs={3} style={{ paddingBottom: "35px" }}>
                <IncludeButton
                  includeFlag={this.props.checkInstanceInCollection(
                    "OSB_" + this.props.data.id,
                    "0"
                  )}
                  model_id={"OSB_" + this.props.data.id}
                  model_name={this.props.data.name}
                  instance_id={"0"}
                  instance_name={""}
                  source_url={
                    this.props.data.repository
                      ? this.props.data.repository
                      : osb_baseUrl + "/projects/" + this.props.data.identifier
                  }
                  view_url={
                    osb_baseUrl + "/projects/" + this.props.data.identifier
                  }
                  addInstanceCollection={this.props.addInstanceCollection}
                  removeInstanceCollection={this.props.removeInstanceCollection}
                />
              </Grid>
            </Grid>
          </Box>
        </div>
      </Grid>
    );
  }
}

export class OSBContent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedRows: [],
      filtering: false,
    };
  }

  render() {
    console.log(this.props);
    return (
      <div>
        <div
          style={{
            paddingBottom: "15px",
            display: "flex",
            alignItems: "center",
          }}
        >
          Please click on &nbsp; <ViewColumnIcon /> &nbsp; to hide/show other
          columns, and click on &nbsp; <FilterListIcon /> &nbsp; to filter the
          contents for each column.
        </div>
        <MaterialTable
          title={
            "Models (" +
            this.props.data.length +
            (this.props.data.length === 1 ? " entry)" : " entries)")
          }
          data={this.props.data}
          columns={OSB_TABLE_COLUMNS}
          options={{
            columnsButton: true,
            search: true,
            paging: false,
            filtering: this.state.filtering,
            sorting: true,
            //   selection: true,
            exportButton: false,
            maxBodyHeight: "60vh",
            headerStyle: {
              position: "sticky",
              top: 0,
              backgroundColor: "#FFF",
              fontWeight: "bolder",
              fontSize: 15,
            },
            rowStyle: (rowData) => ({
              backgroundColor: this.state.selectedRows.includes(
                rowData.tableData.id
              )
                ? "#FFD180"
                : "#EEEEEE",
            }),
          }}
          actions={[
            {
              icon: "filter_list",
              onClick: () =>
                this.setState({ filtering: !this.state.filtering }),
              position: "toolbar",
              tooltip: "Show Filters",
            },
          ]}
          detailPanel={(rowData) => {
            return (
              <OSBContentModelPanel
                data={rowData}
                addInstanceCollection={this.props.addInstanceCollection}
                removeInstanceCollection={this.props.removeInstanceCollection}
                checkInstanceInCollection={this.props.checkInstanceInCollection}
              />
            );
          }}
          onRowClick={(event, selectedRow, togglePanel) => {
            togglePanel();
          }}
          components={{
            Toolbar: (props) => (
              <div
                style={{
                  backgroundColor: "#FFD180",
                  fontWeight: "bolder !important",
                }}
              >
                <MTableToolbar {...props} />
              </div>
            ),
          }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            paddingLeft: "2.5%",
            paddingRight: "2.5%",
            paddingTop: "10px",
            width: "100%",
          }}
        >
          <h6>
            {"Number of model instances selected: " +
              this.props.countTotalInstances()}
          </h6>
        </div>
      </div>
    );
  }
}

export class FilterPanelKG extends React.Component {
  signal = axios.CancelToken.source();
  static contextType = ContextMain;

  constructor(props, context) {
    super(props, context);

    this.state = {
      configFilters: {},
    };

    this.getListModelsKG = this.getListModelsKG.bind(this);
    this.handleFiltersChange = this.handleFiltersChange.bind(this);
  }

  componentDidMount() {
    // Child passes its method to the parent
    this.props.shareGetListModels(this.getListModelsKG);
  }

  getListModelsKG() {
    console.log("Query KG");
    let config = {
      cancelToken: this.signal.token,
      headers: {
        Authorization: "Bearer " + this.context.auth[0].token,
      },
    };
    let query = buildQuery(this.state.configFilters);
    let url =
      baseUrl + "/models/?" + encodeURI(query) + "&size=" + querySizeLimit;
    axios
      .get(url, config)
      .then((res) => {
        const models = res.data;
        console.log(models);
        this.props.setListModels(models, false, null);
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          console.log("errorUpdate: ", err.message);
        } else {
          // Something went wrong. Save the error in state and re-render.
          this.props.setListModels([], false, err);
        }
      });
  }

  handleFiltersChange(event) {
    const newConfig = { ...this.state.configFilters };
    newConfig[event.target.name] =
      typeof event.target.value === "string"
        ? [event.target.value]
        : event.target.value;
    this.setState({ configFilters: newConfig });
  }

  render() {
    return (
      <div>
        <h6>Please specify filters to search KG:</h6>
        <em>Note: you can select multiple values for each filter</em>
        <form>
          {this.props.showFilters.map((filter) => (
            <MultipleSelect
              itemNames={
                !this.props.validKGFilterValues
                  ? []
                  : this.props.validKGFilterValues[filter]
              }
              label={formatLabel(filter)}
              name={filter}
              value={this.state.configFilters[filter] || []}
              handleChange={this.handleFiltersChange}
              key={filter}
            />
          ))}
        </form>
      </div>
    );
  }
}

export class FilterPanelModelDB extends React.Component {
  signal = axios.CancelToken.source();

  constructor(props) {
    super(props);

    this.state = {
      configFilters: {},
      searchByID: true,
      model_ids: "",
    };

    this.getListModelsModelDB = this.getListModelsModelDB.bind(this);
    this.handleFiltersChange = this.handleFiltersChange.bind(this);
    this.toggleSearchByID = this.toggleSearchByID.bind(this);
    this.handleIDsChange = this.handleIDsChange.bind(this);
  }

  componentDidMount() {
    // Child passes its method to the parent
    this.props.shareGetListModels(this.getListModelsModelDB);
  }

  getListModelsModelDB() {
    console.log("Query ModelDB");

    if (this.state.searchByID) {
      // one query per input model ID
      // each query will correspond to a specific model
      let modelDBreqs = [];
      // split csv to list
      let list_model_ids = this.state.model_ids
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item !== "");
      // remove duplicates
      list_model_ids = [...new Set(list_model_ids)];

      list_model_ids.forEach(function (model_id, i) {
        let url = corsProxy + modelDB_baseUrl + "/models/" + model_id;
        modelDBreqs.push(axios.get(url));
      });

      const context = this;
      Promise.allSettled(modelDBreqs)
        .then(function (res) {
          let model_list = [];
          for (let ind in list_model_ids) {
            if (res[ind].status === "fulfilled") {
              let data_dict = {};
              [
                "id",
                "name",
                ...Object.values(filterAttributeMappingModelDB),
              ].forEach(function (item, i) {
                let value = res[ind].value.data[item];
                if (typeof value === "string" || !value) {
                  data_dict[item] = value;
                } else if (typeof value === "number") {
                  data_dict[item] = value.toString();
                } else {
                  if (item === "notes" || item === "public_submitter_email") {
                    data_dict[item] = value.value;
                  } else {
                    let item_value = "";
                    value.value.forEach(function (subitem, j) {
                      item_value = item_value + subitem.object_name + ", ";
                    });
                    data_dict[item] = item_value.slice(0, -2);
                  }
                }
              });
              model_list.push(data_dict);
            } else {
              showNotification(
                context.props.enqueueSnackbar,
                context.props.closeSnackbar,
                "Invalid Model ID: " + list_model_ids[ind] + "!",
                "error"
              );
            }
          }

          console.log(model_list);
          // create model entries from collected attributes
          context.props.setListModels(model_list, false, null);
        })
        .catch((err) => {
          if (axios.isCancel(err)) {
            console.log("errorUpdate: ", err.message);
          } else {
            // Something went wrong. Save the error in state and re-render.
            context.props.setListModels([], false, err);
          }
        });
    } else {
      // one query per required column (attribute)
      // each query will correspond to values for specific attribute
      let query = buildQuery(this.state.configFilters);
      let modelDBreqs = [];
      for (let item of [
        "id",
        "name",
        ...Object.values(filterAttributeMappingModelDB),
      ]) {
        let url =
          corsProxy +
          modelDB_baseUrl +
          "/models/" +
          item +
          "?" +
          encodeURI(query);
        modelDBreqs.push(axios.get(url));
      }

      const context = this;
      Promise.all(modelDBreqs)
        .then(function (res) {
          console.log(res);
          let model_list = [];
          for (let ind in res[0].data) {
            let data_dict = {};
            [
              "id",
              "name",
              ...Object.values(filterAttributeMappingModelDB),
            ].forEach(function (item, i) {
              if (typeof res[i].data[ind] === "string" || !res[i].data[ind]) {
                data_dict[item] = res[i].data[ind];
              } else if (typeof res[i].data[ind] === "number") {
                data_dict[item] = res[i].data[ind].toString();
              } else {
                console.log(res[i].data[ind].value);
                console.log(typeof res[i].data[ind].value);
                console.log(item);
                let value = "";
                if (typeof res[i].data[ind].value === "string") {
                  data_dict[item] = res[i].data[ind].value;
                } else {
                  res[i].data[ind].value.forEach(function (subitem, j) {
                    value = value + subitem.object_name + ", ";
                  });
                  data_dict[item] = value.slice(0, -2);
                }
              }
            });
            model_list.push(data_dict);
          }

          console.log(model_list);
          // create model entries from collected attributes
          context.props.setListModels(model_list, false, null);
        })
        .catch((err) => {
          if (axios.isCancel(err)) {
            console.log("errorUpdate: ", err.message);
          } else {
            // Something went wrong. Save the error in state and re-render.
            this.props.setListModels([], false, err);
          }
        });
    }
  }

  handleFiltersChange(event) {
    const newConfig = { ...this.state.configFilters };
    newConfig[event.target.name] =
      typeof event.target.value === "string"
        ? [event.target.value]
        : event.target.value;
    this.setState({ configFilters: newConfig });
  }

  toggleSearchByID() {
    if (this.state.searchByID) {
      this.setState({
        model_ids: "",
        searchByID: false,
      });
    } else {
      this.setState({
        configFilters: {},
        searchByID: true,
      });
    }
  }

  handleIDsChange(event) {
    this.setState({
      model_ids: event.target.value,
    });
  }

  render() {
    return (
      <div>
        <Grid item xs={12} style={{ paddingBottom: "10px" }}>
          <h6>
            <span style={{ paddingRight: "10px" }}>
              Do you wish to search by model ID?
            </span>
            <ToggleSwitch
              id="searchSwitch"
              checked={this.state.searchByID}
              onChange={this.toggleSearchByID}
            />
          </h6>
        </Grid>
        {this.state.searchByID && (
          <div>
            <h6>Please enter the model IDs below:</h6>
            <em>
              Note: you can enter multiple IDs by separating them with a comma
              (e.g. 87284, 128079)
            </em>
            <form>
              <TextField
                variant="outlined"
                fullWidth={true}
                name="ModelDB_model_ids"
                value={this.state.model_ids}
                onChange={this.handleIDsChange}
                InputProps={{
                  style: {
                    padding: "5px 15px",
                    minWidth: 700,
                    maxWidth: 900,
                    marginTop: "10px",
                  },
                }}
              />
            </form>
          </div>
        )}
        {!this.state.searchByID && (
          <div>
            <h6>Please specify filters to search ModelDB:</h6>
            <em>Note: you can select only one value for each filter</em>
            <form>
              {this.props.showFilters.map((filter) => (
                <SingleSelect
                  itemNames={
                    !this.props.validModelDBFilterValues
                      ? []
                      : this.props.validModelDBFilterValues[filter]
                  }
                  label={labelsModelDBKeys[filter]}
                  name={filterAttributeMappingModelDB[filter]}
                  value={
                    this.state.configFilters[
                      filterAttributeMappingModelDB[filter]
                    ] || ""
                  }
                  handleChange={this.handleFiltersChange}
                  key={filter}
                />
              ))}
            </form>
          </div>
        )}
      </div>
    );
  }
}

export class FilterPanelOSB extends React.Component {
  signal = axios.CancelToken.source();

  constructor(props) {
    super(props);

    this.state = {
      searchByID: true,
      model_ids: "",
    };

    this.getListModelsOSB = this.getListModelsOSB.bind(this);
    this.toggleSearchByID = this.toggleSearchByID.bind(this);
    this.handleIDsChange = this.handleIDsChange.bind(this);
  }

  componentDidMount() {
    // Child passes its method to the parent
    this.props.shareGetListModels(this.getListModelsOSB);
  }

  getListModelsOSB() {
    console.log("Query ModelDB");

    if (this.state.searchByID) {
      // one query per input model identifier
      // each query will correspond to a specific model
      let modelDBreqs = [];
      // split csv to list
      let list_model_ids = this.state.model_ids
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item !== "");
      // remove duplicates
      list_model_ids = [...new Set(list_model_ids)];

      list_model_ids.forEach(function (model_id, i) {
        let url = corsProxy + osb_baseUrl + "/projects/" + model_id + ".json";
        modelDBreqs.push(axios.get(url));
      });

      const context = this;
      Promise.allSettled(modelDBreqs)
        .then(function (res) {
          console.log(res);
          let model_list = [];
          for (let ind in list_model_ids) {
            if (res[ind].status === "fulfilled") {
              let model = res[ind].value.data.project;
              model_list.push({
                id: model.id.toString(),
                identifier: model.identifier,
                name: model.name,
                created_on: model.created_on,
                updated_on: model.updated_on,
                is_public: model.is_public.toString(),
                description: model.description,
                homepage: model.homepage,
                classification: model.custom_fields[11].value,
                family: model.custom_fields[12].value,
                species: model.custom_fields[13].value,
                brain_region: model.custom_fields[14].value,
                cell_type: model.custom_fields[15].value,
                original_format: model.custom_fields[0].value,
                repository: model.custom_fields[4].value
                  ? model.custom_fields[4].value // GitHub repo
                  : model.custom_fields[16].value, // Bitbucket repo
              });
            } else {
              showNotification(
                context.props.enqueueSnackbar,
                context.props.closeSnackbar,
                "Invalid Model Identifier: " + list_model_ids[ind] + "!",
                "error"
              );
            }
          }

          console.log(model_list);
          // create model entries from collected attributes
          context.props.setListModels(model_list, false, null);
        })
        .catch((err) => {
          if (axios.isCancel(err)) {
            console.log("errorUpdate: ", err.message);
          } else {
            // Something went wrong. Save the error in state and re-render.
            this.props.setListModels([], false, err);
          }
        });
    } else {
      // as OSB APIs don't accept filters, we retrieve all the models (projects)
      let url =
        corsProxy + osb_baseUrl + "/projects.json?limit=" + querySizeLimit;
      const context = this;
      axios
        .get(url)
        .then(function (res) {
          console.log(res);
          let model_list = [];
          for (let model of res.data.projects) {
            model_list.push({
              id: model.id.toString(),
              identifier: model.identifier,
              name: model.name,
              created_on: model.created_on,
              updated_on: model.updated_on,
              is_public: model.is_public.toString(),
              description: model.description,
              homepage: model.homepage,
              classification: model.custom_fields[11].value,
              family: model.custom_fields[12].value,
              species: model.custom_fields[13].value,
              brain_region: model.custom_fields[14].value,
              cell_type: model.custom_fields[15].value,
              original_format: model.custom_fields[0].value,
              repository: model.custom_fields[4].value
                ? model.custom_fields[4].value // GitHub repo
                : model.custom_fields[16].value, // Bitbucket repo
            });
          }

          console.log(model_list);
          // create model entries from collected attributes
          context.props.setListModels(model_list, false, null);
        })
        .catch((err) => {
          if (axios.isCancel(err)) {
            console.log("errorUpdate: ", err.message);
          } else {
            // Something went wrong. Save the error in state and re-render.
            this.props.setListModels([], false, err);
          }
        });
    }
  }

  toggleSearchByID() {
    if (this.state.searchByID) {
      this.setState({
        model_ids: "",
        searchByID: false,
      });
    } else {
      this.setState({
        searchByID: true,
      });
    }
  }

  handleIDsChange(event) {
    this.setState({
      model_ids: event.target.value,
    });
  }

  render() {
    return (
      <div>
        <Grid item xs={12} style={{ paddingBottom: "10px" }}>
          <h6>
            <span style={{ paddingRight: "10px" }}>
              Do you wish to search by model identifier?
            </span>
            <ToggleSwitch
              id="searchSwitch"
              checked={this.state.searchByID}
              onChange={this.toggleSearchByID}
            />
          </h6>
        </Grid>
        {this.state.searchByID && (
          <div>
            <h6>Please enter the model identifiers below:</h6>
            <em>
              Note: you can enter multiple identifiers by separating them with a
              comma (e.g. thalamocortical, potjansdiesmann2014)
            </em>
            <form>
              <TextField
                variant="outlined"
                fullWidth={true}
                name="OSB_model_ids"
                value={this.state.model_ids}
                onChange={this.handleIDsChange}
                InputProps={{
                  style: {
                    padding: "5px 15px",
                    minWidth: 700,
                    maxWidth: 900,
                    marginTop: "10px",
                  },
                }}
              />
            </form>
          </div>
        )}
        {!this.state.searchByID && (
          <div>
            <h6>
              Click "Proceed" to fetch all entries from OSB, and you can
              subsequently filter them by individual attributes.
            </h6>
          </div>
        )}
      </div>
    );
  }
}

export default class DBInputModels extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      list_models: [],
      error: null,
      model_collection: {},
      showFilters: true,
      sourceDB: "Knowledge Graph",
    };

    this.acceptsProceedMethod = this.acceptsProceedMethod.bind(this);
    this.handleProceed = this.handleProceed.bind(this);
    this.setListModels = this.setListModels.bind(this);

    this.handleErrorDialogClose = this.handleErrorDialogClose.bind(this);
    this.addInstanceCollection = this.addInstanceCollection.bind(this);
    this.removeInstanceCollection = this.removeInstanceCollection.bind(this);
    this.checkInstanceInCollection = this.checkInstanceInCollection.bind(this);
    this.countTotalInstances = this.countTotalInstances.bind(this);
    this.showFiltersPanel = this.showFiltersPanel.bind(this);
    this.showContentsPanel = this.showContentsPanel.bind(this);
    this.handleDBChange = this.handleDBChange.bind(this);
  }

  acceptsProceedMethod(childGetListMethod) {
    // Parent stores the method that the child passed
    this.getListModels = childGetListMethod;
  }

  handleProceed() {
    this.setState(
      {
        showFilters: false,
        loading: true,
      },
      () => {
        this.getListModels();
      }
    );
  }

  setListModels(list_models, loading, error) {
    this.setState({
      list_models: list_models,
      loading: loading,
      error: error,
    });
  }

  handleErrorDialogClose() {
    this.setState({ error: null });
  }

  addInstanceCollection(
    model_id,
    model_name,
    instance_id,
    instance_name,
    source_url,
    view_url
  ) {
    console.log("Add");

    let model_collection = this.state.model_collection;
    if (Object.keys(model_collection).includes(model_id)) {
      if (!Object.keys(model_collection[model_id]).includes(instance_id)) {
        model_collection[model_id][instance_id] = {
          label: instance_name
            ? model_name + " (" + instance_name + ")"
            : model_name,
          source_url: source_url,
          view_url: view_url,
        };
      }
    } else {
      model_collection[model_id] = {
        [instance_id]: {
          label: instance_name
            ? model_name + " (" + instance_name + ")"
            : model_name,
          source_url: source_url,
          view_url: view_url,
        },
      };
    }

    this.setState({
      model_collection: model_collection,
    });
  }

  removeInstanceCollection(model_id, instance_id) {
    console.log("Remove");

    let model_collection = this.state.model_collection;
    console.log(model_collection);
    if (Object.keys(model_collection).includes(model_id)) {
      if (Object.keys(model_collection[model_id]).includes(instance_id)) {
        delete model_collection[model_id][instance_id];
      }
      if (Object.keys(model_collection[model_id]).length === 0) {
        delete model_collection[model_id];
      }
    }

    this.setState({
      model_collection: model_collection,
    });
  }

  checkInstanceInCollection(model_id, instance_id) {
    let flag = false;
    let model_collection = this.state.model_collection;
    if (Object.keys(model_collection).includes(model_id)) {
      if (Object.keys(model_collection[model_id]).includes(instance_id)) {
        flag = true;
      }
    }
    console.log(flag);
    return flag;
  }

  countTotalInstances() {
    let total = 0;
    let model_collection = this.state.model_collection;
    for (let model_id in model_collection) {
      total += Object.keys(model_collection[model_id]).length;
    }
    return total;
  }

  showFiltersPanel() {
    let showFilters = "";
    switch (this.state.sourceDB) {
      case "Knowledge Graph":
        showFilters = filterKGModelsKeys;
        break;
      case "ModelDB":
        showFilters = filterModelDBKeys;
        break;
      case "Open Source Brain":
        showFilters = null;
        break;
      case "BioModels":
        showFilters = null;
        break;
      default:
        showFilters = null;
    }

    return (
      <Box my={2}>
        <h6 style={{ marginBottom: "20px" }}>Please specify the database:</h6>
        <SwitchMultiWay
          values={[
            "Knowledge Graph",
            "ModelDB",
            "Open Source Brain",
            "BioModels",
          ]}
          selected={this.state.sourceDB}
          onChange={this.handleDBChange}
        />
        <br />
        {this.state.sourceDB === "Knowledge Graph" && (
          <FilterPanelKG
            showFilters={showFilters}
            validKGFilterValues={this.props.validKGFilterValues}
            shareGetListModels={this.acceptsProceedMethod}
            setListModels={this.setListModels}
          />
        )}
        {this.state.sourceDB === "ModelDB" && (
          <FilterPanelModelDB
            showFilters={showFilters}
            validModelDBFilterValues={this.props.validModelDBFilterValues}
            shareGetListModels={this.acceptsProceedMethod}
            setListModels={this.setListModels}
            enqueueSnackbar={this.props.enqueueSnackbar}
            closeSnackbar={this.props.closeSnackbar}
          />
        )}
        {this.state.sourceDB === "Open Source Brain" && (
          <FilterPanelOSB
            shareGetListModels={this.acceptsProceedMethod}
            setListModels={this.setListModels}
            enqueueSnackbar={this.props.enqueueSnackbar}
            closeSnackbar={this.props.closeSnackbar}
          />
        )}
      </Box>
    );
  }

  showContentsPanel() {
    if (this.state.sourceDB === "Knowledge Graph") {
      return (
        <KGContent
          data={this.state.list_models}
          addInstanceCollection={this.addInstanceCollection}
          removeInstanceCollection={this.removeInstanceCollection}
          checkInstanceInCollection={this.checkInstanceInCollection}
          countTotalInstances={this.countTotalInstances}
        />
      );
    } else if (this.state.sourceDB === "ModelDB") {
      return (
        <ModelDBContent
          data={this.state.list_models}
          addInstanceCollection={this.addInstanceCollection}
          removeInstanceCollection={this.removeInstanceCollection}
          checkInstanceInCollection={this.checkInstanceInCollection}
          countTotalInstances={this.countTotalInstances}
        />
      );
    } else if (this.state.sourceDB === "Open Source Brain") {
      return (
        <OSBContent
          data={this.state.list_models}
          addInstanceCollection={this.addInstanceCollection}
          removeInstanceCollection={this.removeInstanceCollection}
          checkInstanceInCollection={this.checkInstanceInCollection}
          countTotalInstances={this.countTotalInstances}
        />
      );
    } else {
      return null;
    }
  }

  handleDBChange(value) {
    console.log(value);
    this.setState({
      sourceDB: value,
      list_models: [],
    });
  }

  render() {
    // console.log(this.props);
    console.log(this.state);

    if (this.state.error) {
      return (
        <ErrorDialog
          open={Boolean(this.state.error)}
          handleErrorDialogClose={this.handleErrorDialogClose}
          error={this.state.error.message || this.state.error}
        />
      );
    }
    return (
      <div>
        <Dialog
          onClose={() => this.props.handleClose(false)}
          aria-labelledby="customized-dialog-title"
          open={this.props.open}
          fullWidth={this.state.showFilters ? false : true}
          maxWidth={"xl"}
          //   disableBackdropClick={true}
          //   disableEscapeKeyDown={true}
        >
          <DialogTitle
            id="customized-dialog-title"
            onClose={() => this.props.handleClose(false)}
            style={{ backgroundColor: "#ffd180" }}
          >
            <span style={{ fontWeight: "bolder", fontSize: 18 }}>
              Input From Database
            </span>
          </DialogTitle>
          <DialogContent dividers>
            {(!this.props.validKGFilterValues && this.state.showFilters) ||
            this.state.loading ? (
              <div
                style={{
                  minWidth: 700,
                  maxWidth: 900,
                }}
              >
                <LoadingIndicator />
              </div>
            ) : this.state.showFilters ? (
              this.showFiltersPanel()
            ) : (
              this.showContentsPanel()
            )}
          </DialogContent>
          <DialogActions>
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                paddingLeft: "2.5%",
                paddingRight: "2.5%",
                paddingTop: "10px",
                paddingBottom: "20px",
                width: "100%",
              }}
            >
              <Button
                variant="contained"
                color="primary"
                style={{
                  width: "150px",
                  backgroundColor: "#FF9800",
                  color: "#000000",
                  fontWeight: "bold",
                  border: "solid",
                  borderColor: "#000000",
                  borderWidth: "1px",
                }}
                onClick={() => this.props.handleClose(false, null)}
              >
                Cancel
              </Button>
              <br />
              <br />
              {!this.state.showFilters && (
                <>
                  <Button
                    variant="contained"
                    color="primary"
                    style={{
                      width: "150px",
                      backgroundColor: "#01579B",
                      color: "#FFFFFF",
                      fontWeight: "bold",
                      border: "solid",
                      borderColor: "#000000",
                      borderWidth: "1px",
                    }}
                    onClick={() => {
                      this.setState({ showFilters: true });
                    }}
                  >
                    Filters
                  </Button>
                  <br />
                  <br />
                </>
              )}
              <Button
                variant="contained"
                color="primary"
                style={{
                  width: "150px",
                  backgroundColor: "#8BC34A",
                  color: "#000000",
                  fontWeight: "bold",
                  border: "solid",
                  borderColor: "#000000",
                  borderWidth: "1px",
                }}
                onClick={() =>
                  this.state.showFilters
                    ? this.handleProceed()
                    : this.props.handleClose(
                        true,
                        this.state.model_collection,
                        this.state.sourceDB
                      )
                }
              >
                {this.state.showFilters ? "Proceed" : "Add Items"}
              </Button>
            </div>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
