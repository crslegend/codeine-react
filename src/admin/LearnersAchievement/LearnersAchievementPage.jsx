import React, { Fragment, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Card,
  CardMedia,
  Typography,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  IconButton,
  Button,
  TextField,
  Avatar,
  MenuItem,
  Tooltip,
} from "@material-ui/core";
import SearchBar from "material-ui-search-bar";
import Pagination from "@material-ui/lab/Pagination";
import { DropzoneAreaBase } from "material-ui-dropzone";
import { Add, Close, Clear } from "@material-ui/icons";
import Toast from "../../components/Toast.js";
import Service from "../../AxiosService";

const useStyles = makeStyles((theme) => ({
  cardroot: {
    backgroundColor: "#164D8F",
    height: "300px",
    borderRadius: 0,
  },
  cardnumber: {
    color: "#FFFFFF",
    lineHeight: "40px",
    margin: "30px 0px 20px 30px",
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  avatar: {
    width: theme.spacing(15),
    height: theme.spacing(15),
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    margin: "2px 0px 2px 10px",
    fontSize: "12px",
    backgroundColor: "#164D8F",
    color: "#FFFFFF",
  },
  cardmedia: {
    height: "150px",
    width: "150px",
    borderRadius: "50%",
    margin: "28px",
  },
  description: {
    borderRadius: 0,
    backgroundColor: "none",
    padding: "15px 10px",
  },
  paginationSection: {
    marginLeft: "auto",
    marginRight: "30px",
    marginTop: theme.spacing(2),
    paddingBottom: theme.spacing(5),
  },
  pagination: {
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
    [theme.breakpoints.down("sm")]: {
      size: "small",
    },
  },
}));

const stats = [
  {
    value: "ML",
    label: "Machine Learning",
  },
  {
    value: "DB",
    label: "Database Administration",
  },
  {
    value: "SEC",
    label: "Security",
  },
  {
    value: "UI",
    label: "UI/UX",
  },
  {
    value: "FE",
    label: "Frontend",
  },
  {
    value: "BE",
    label: "Backend",
  },
  {
    value: "PY",
    label: "Python",
  },
  {
    value: "JAVA",
    label: "Java",
  },
  {
    value: "JS",
    label: "Javascript",
  },
  {
    value: "CPP",
    label: "C++",
  },
  {
    value: "CS",
    label: "C#",
  },
  {
    value: "HTML",
    label: "HTML",
  },
  {
    value: "CSS",
    label: "CSS",
  },
  {
    value: "RUBY",
    label: "Ruby",
  },
];

const AdminLearnersAchievementPage = () => {
  const classes = useStyles();

  const [sbOpen, setSbOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    message: "",
    severity: "error",
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "center",
    },
    autoHideDuration: 3000,
  });

  const [badges, setBadges] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [newBadge, setNewBadge] = useState({
    badge: "",
    title: "",
  });
  const [requirementList, setRequirementList] = useState([]);
  const [newBadgeRequirement, setNewBadgeRequirement] = useState({
    experience_point: "0",
    stat: "",
  });
  const [avatar, setAvatar] = useState();

  const itemsPerPage = 20;
  const [page, setPage] = useState(1);
  const [noOfPages, setNumPages] = useState(
    Math.ceil(badges.length / itemsPerPage)
  );

  const [openAchievementDialog, setOpenAchievementDialog] = useState(false);

  const [openBadgePicDialog, setOpenBadgePicDialog] = useState(false);

  const formatDate = (date) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    if (date !== null) {
      const newDate = new Date(date).toLocaleDateString(undefined, options);
      // console.log(newDate);
      return newDate;
    }
    return "";
  };

  const handleOpenAchievementDialog = (e) => {
    setOpenAchievementDialog(true);
  };

  const handleCloseAchievementDialog = () => {
    setOpenAchievementDialog(false);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleSetPoint = (event) => {
    setNewBadgeRequirement({
      ...newBadgeRequirement,
      experience_point: event.target.value,
    });
  };

  const handleSetStat = (event) => {
    setNewBadgeRequirement({
      ...newBadgeRequirement,
      stat: event.target.value,
    });
  };

  const handleDeleteStat = (index) => {
    // console.log(index);

    let arr = [...requirementList];
    arr.splice(index, 1); // use this instead of filter to cover the case where all values are the same
    // console.log(arr);
    setRequirementList(arr);
  };

  const handleAddToList = (newBadgeRequirement) => {
    if (
      newBadgeRequirement.experience_point === undefined ||
      newBadgeRequirement.experience_point === ""
    ) {
      setSbOpen(true);
      setSnackbar({
        message: "Enter experience points requirements",
        severity: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
        autoHideDuration: 3000,
      });
      return;
    } else if (newBadgeRequirement.stat === "") {
      setSbOpen(true);
      setSnackbar({
        message: "State statistics requirements",
        severity: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
        autoHideDuration: 3000,
      });
      return;
    } else {
      setRequirementList(requirementList.concat(newBadgeRequirement));
      setNewBadgeRequirement({ experience_point: "", stat: "" });
      console.log(requirementList);
    }
  };

  const handleResetFields = () => {
    setAvatar();
    setNewBadge({ badge: "", title: "" });
    setRequirementList([]);
    setNewBadgeRequirement({ experience_point: "0", stat: "" });
  };

  const submitNewAchievement = () => {
    console.log(newBadge);
    console.log(requirementList);

    if (newBadge.title === "" || newBadge.title === undefined) {
      setSbOpen(true);
      setSnackbar({
        message: "Enter a badge title",
        severity: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
        autoHideDuration: 3000,
      });
      return;
    }
    if (newBadge.badge === undefined || newBadge.badge === "") {
      setSbOpen(true);
      setSnackbar({
        message: "Attach a logo to the badge",
        severity: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
        autoHideDuration: 3000,
      });
      return;
    }
    if (requirementList.length === 0 && newBadgeRequirement.stat === "") {
      setSbOpen(true);
      setSnackbar({
        message: "State statistics requirements",
        severity: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
        autoHideDuration: 3000,
      });
      return;
    }
    if (
      requirementList.length === 0 &&
      newBadgeRequirement.experience_point === ""
    ) {
      setSbOpen(true);
      setSnackbar({
        message: "Enter experience points requirements",
        severity: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
        autoHideDuration: 3000,
      });
      return;
    }

    const formData = new FormData();
    formData.append("title", newBadge.title);
    formData.append("badge", avatar[0].file);

    // to handle submission with only one stat requirement
    if (
      requirementList.length === 0 &&
      newBadgeRequirement.stat !== "" &&
      newBadgeRequirement.experience_point !== ""
    ) {
      Service.client
        .post(`/achievements`, formData)
        .then((res) => {
          console.log(res);
          Service.client
            .post(
              `/achievements/${res.data.id}/requirements`,
              newBadgeRequirement
            )
            .then((res) => {
              setOpenAchievementDialog(false);
              handleResetFields();
              getBadgesData();
              setSbOpen(true);
              setSnackbar({
                message: "New badge successfully created!",
                severity: "success",
                anchorOrigin: {
                  vertical: "bottom",
                  horizontal: "center",
                },
                autoHideDuration: 3000,
              });
            })
            .catch((err) => {
              console.log(err);
              setOpenAchievementDialog(false);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const getBadgesData = () => {
    Service.client
      .get(`/achievements`, { params: { title: searchValue } })
      .then((res) => {
        res.data
          .sort((a, b) => a.is_deleted - b.is_deleted)
          .sort((a, b) => b.timestamp.localeCompare(a.timestamp));
        setBadges(res.data);
        setNumPages(Math.ceil(res.data.length / itemsPerPage));
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleRequestSearch = () => {
    getBadgesData();
  };

  const handleCancelSearch = () => {
    setSearchValue("");
  };

  useEffect(() => {
    getBadgesData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ height: "calc(100vh - 115px)" }}>
      <Toast open={sbOpen} setOpen={setSbOpen} {...snackbar} />
      <Grid container style={{ marginBottom: "20px" }}>
        <Grid item xs={12}>
          <Typography variant="h3" style={{ fontWeight: 700 }}>
            Learners Achievement
          </Typography>
        </Grid>
        <Grid item xs={12} style={{ margin: "30px 0px" }}>
          <div style={{ width: "65%" }}>
            <SearchBar
              placeholder="Search Badges"
              value={searchValue}
              onChange={(newValue) => setSearchValue(newValue)}
              onCancelSearch={handleCancelSearch}
              onRequestSearch={handleRequestSearch}
              classes={{
                input: classes.input,
              }}
            />
          </div>
        </Grid>
      </Grid>

      <Grid container>
        <Grid
          item
          xs={8}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "650px",
          }}
        >
          <div
            style={{
              display: "flex",
              width: "100%",
              marginRight: "10px",
              flexWrap: "wrap",
            }}
          >
            {badges && badges.length > 0 ? (
              badges
                .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                .map((badge) => (
                  <Tooltip
                    title={
                      <Card className={classes.description}>
                        <Typography
                          variant="h6"
                          style={{
                            textAlign: "center",
                            fontWeight: 700,
                            marginBottom: badge.is_deleted ? "0px" : "5px",
                            color: "#164D8F",
                          }}
                        >
                          {badge.title}
                        </Typography>
                        {badge && badge.is_deleted ? (
                          <Typography
                            variant="body2"
                            style={{
                              color: "#CC0000",
                              textAlign: "center",
                              marginBottom: "5px",
                            }}
                          >
                            [Deleted]
                          </Typography>
                        ) : (
                          ""
                        )}
                        <Typography variant="body2">
                          Date created: {formatDate(badge.timestamp)}
                        </Typography>
                        <Typography
                          variant="body1"
                          style={{
                            fontWeight: 700,
                            margin: "10px 0px 3px",
                          }}
                        >
                          Requirements
                        </Typography>
                        <Typography variant="body2">
                          Experience points:{" "}
                          {badge.achievement_requirements[0] &&
                            badge.achievement_requirements[0].experience_point}
                          <br />
                          {/*badge &&
                          badge.achievement_requirements[0].stat.map(
                            (label) => <Label label={label} />
                          )*/}
                        </Typography>
                      </Card>
                    }
                  >
                    <CardMedia
                      className={classes.cardmedia}
                      image={badge.badge}
                      style={{
                        webkitFilter: badge.is_deleted
                          ? "brightness(50%)"
                          : "brightness(100%)",
                      }}
                    />
                  </Tooltip>
                ))
            ) : (
              <div
                style={{
                  height: "100px",
                  display: "grid",
                  margin: "0 auto",
                }}
              >
                <Typography
                  variant="h3"
                  style={{
                    textAlign: "center",
                    lineHeight: "40px",
                    margin: "60px auto",
                    color: "#9B9B9B",
                  }}
                >
                  Codeine has no achievement badges. <br />
                  Help create one today!
                </Typography>
              </div>
            )}
          </div>
          <div className={classes.paginationSection}>
            {badges && badges.length > 0 && (
              <Pagination
                count={noOfPages}
                page={page}
                onChange={handlePageChange}
                defaultPage={1}
                color="primary"
                size="medium"
                showFirstButton
                showLastButton
                className={classes.pagination}
              />
            )}
          </div>
        </Grid>
        <Grid item xs={3}>
          <Card className={classes.cardroot}>
            <Typography variant="h4" className={classes.cardnumber}>
              Total number of <br />
              badges:
            </Typography>

            <Typography
              style={{
                color: "#FFFFFF",
                fontSize: "54px",
                fontWeight: 700,
                marginLeft: "30px",
              }}
            >
              {badges && badges.length}
            </Typography>
          </Card>
          <Button
            variant="outlined"
            style={{
              borderColor: "#164D8F",
              color: "#164D8F",
              marginTop: "20px",
              width: "100%",
            }}
            onClick={handleOpenAchievementDialog}
          >
            <Add style={{ color: "#164D8F" }} />
            New achievement
          </Button>
        </Grid>
      </Grid>

      <Dialog
        open={openAchievementDialog}
        onClose={handleCloseAchievementDialog}
        aria-labelledby="form-dialog-title"
        maxWidth="sm"
        fullWidth={true}
      >
        <DialogTitle id="form-dialog-title">
          Create a New Badge
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={handleCloseAchievementDialog}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Grid container>
              <Grid item xs={4}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: "15px",
                  }}
                >
                  <IconButton onClick={() => setOpenBadgePicDialog(true)}>
                    {avatar ? (
                      <Avatar
                        className={classes.avatar}
                        src={avatar[0].data}
                      ></Avatar>
                    ) : (
                      <Avatar
                        className={classes.avatar}
                        style={{ padding: "20px" }}
                      >
                        Upload badge logo
                      </Avatar>
                    )}
                  </IconButton>
                </div>
              </Grid>
              <Grid item xs={8}>
                <div>
                  <label htmlFor="title">
                    <Typography
                      variant="body2"
                      style={{
                        marginTop: "30px",
                      }}
                    >
                      Badge Title
                    </Typography>
                  </label>
                  <TextField
                    id="title"
                    style={{
                      width: "85%",
                    }}
                    variant="outlined"
                    margin="dense"
                    value={newBadge && newBadge.title}
                    onChange={(e) =>
                      setNewBadge({
                        ...newBadge,
                        title: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={12}>
                <Typography
                  variant="body1"
                  style={{
                    color: "#000000",
                    marginBottom: "10px",
                  }}
                >
                  Requirements
                </Typography>
              </Grid>
            </Grid>
            {requirementList &&
              requirementList.map((option, index) => {
                return (
                  <Grid container>
                    <Grid item xs={6}>
                      <label htmlFor="stat">
                        <Typography variant="body2">Statistics</Typography>
                      </label>
                      <TextField
                        id="stat"
                        fullWidth
                        disabled
                        variant="outlined"
                        margin="dense"
                        value={option && option.stat}
                      >
                        {stats.map((options) => (
                          <MenuItem
                            style={{ height: "35px", fontSize: "14px" }}
                            key={options.value}
                            value={options.stat}
                          >
                            {options.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={1} />
                    <Grid item xs={3}>
                      <div>
                        <label htmlFor="points">
                          <Typography variant="body2">Exp. Points</Typography>
                        </label>
                        <TextField
                          id="points"
                          disabled
                          fullWidth
                          variant="outlined"
                          margin="dense"
                          type="number"
                          InputProps={{
                            inputProps: { min: 0 },
                          }}
                          value={option && option.experience_point}
                        />
                      </div>
                    </Grid>
                    {requirementList && requirementList.length > 0 && (
                      <IconButton
                        size="small"
                        style={{ marginLeft: "25px", marginTop: "20px" }}
                        onClick={() => {
                          handleDeleteStat(index);
                        }}
                      >
                        <Clear color="secondary" />
                      </IconButton>
                    )}
                  </Grid>
                );
              })}

            <Grid
              container
              style={{ marginTop: requirementList.length > 0 ? "30px" : "0px" }}
            >
              <Grid item xs={6}>
                <div>
                  <label htmlFor="stat">
                    <Typography variant="body2">Statistics</Typography>
                  </label>
                  <TextField
                    id="stat"
                    fullWidth
                    variant="outlined"
                    margin="dense"
                    select
                    SelectProps={{
                      MenuProps: {
                        style: {
                          height: "250px",
                        },
                        anchorOrigin: {
                          vertical: "bottom",
                          horizontal: "left",
                        },
                        getContentAnchorEl: null,
                      },
                    }}
                    value={newBadgeRequirement && newBadgeRequirement.stat}
                    onChange={(e) =>
                      setNewBadgeRequirement({
                        ...newBadgeRequirement,
                        stat: e.target.value,
                      })
                    }
                  >
                    {stats.map((option) => (
                      <MenuItem
                        style={{ height: "35px", fontSize: "14px" }}
                        key={option.value}
                        value={option.value}
                      >
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>
              </Grid>
              <Grid item xs={1} />
              <Grid item xs={3}>
                <div>
                  <label htmlFor="points">
                    <Typography variant="body2">Exp. Points</Typography>
                  </label>
                  <TextField
                    id="points"
                    fullWidth
                    variant="outlined"
                    margin="dense"
                    type="number"
                    InputProps={{
                      inputProps: { min: 0 },
                    }}
                    value={
                      newBadgeRequirement &&
                      newBadgeRequirement.experience_point
                    }
                    onChange={(e) =>
                      setNewBadgeRequirement({
                        ...newBadgeRequirement,
                        experience_point: e.target.value,
                      })
                    }
                  />
                </div>
              </Grid>
              <IconButton
                size="small"
                style={{ marginLeft: "25px", marginTop: "20px" }}
                onClick={() => {
                  handleAddToList(newBadgeRequirement);
                }}
              >
                <Add color="secondary" />
              </IconButton>
            </Grid>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            style={{ margin: "10px 15px" }}
            variant="contained"
            onClick={() => submitNewAchievement()}
            color="secondary"
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        disableEscapeKeyDown
        open={openBadgePicDialog}
        onClose={() => setOpenBadgePicDialog(false)}
        PaperProps={{
          style: {
            minWidth: "400px",
            maxWidth: "400px",
          },
        }}
      >
        <DialogContent>
          <DropzoneAreaBase
            dropzoneText="Drag and drop an image or click here&nbsp;"
            acceptedFiles={["image/*"]}
            filesLimit={1}
            maxFileSize={5000000}
            fileObjects={avatar}
            onAdd={(newPhoto) => {
              setAvatar(newPhoto);
            }}
            onDelete={(deletePhotoObj) => {
              setAvatar();
            }}
            previewGridProps={{
              item: {
                xs: "auto",
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={() => {
              setAvatar();
              setOpenBadgePicDialog(false);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setAvatar(avatar && avatar);
              setNewBadge({
                ...newBadge,
                badge: avatar && avatar[0].file.name,
              });
              setOpenBadgePicDialog(false);
            }}
            disabled={avatar === ""}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AdminLearnersAchievementPage;
