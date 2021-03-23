import React, { useEffect, useState } from "react";
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
  IconButton,
  Button,
  TextField,
  Avatar,
  MenuItem,
  Tooltip,
  Divider,
} from "@material-ui/core";
import SearchBar from "material-ui-search-bar";
import Pagination from "@material-ui/lab/Pagination";
import { DropzoneAreaBase } from "material-ui-dropzone";
import { Add, Close, Clear, Done } from "@material-ui/icons";
import Toast from "../../components/Toast.js";
import Service from "../../AxiosService";

const useStyles = makeStyles((theme) => ({
  cardroot: {
    backgroundColor: "#164D8F",
    height: "420px",
    borderRadius: 0,
  },
  cardnumber: {
    color: "#FFFFFF",
    lineHeight: "35px",
    margin: "30px 0px 15px 30px",
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
    height: "120px",
    width: "120px",
    borderRadius: "50%",
    margin: "28px",
  },
  description: {
    borderRadius: 0,
    backgroundColor: "transparent",
    color: "#FFFFFF",
    padding: "15px 10px",
  },
  tooltip: { backgroundColor: "#164D8F" },
  paginationSection: {
    marginLeft: "auto",
    marginRight: "30px",
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(4),
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
  const [selectedBadge, setSelectedBadge] = useState();

  const [searchValue, setSearchValue] = useState("");
  const [newBadge, setNewBadge] = useState({
    badge: "",
    title: "",
  });
  const [requirementList, setRequirementList] = useState([]);
  const [newBadgeRequirement, setNewBadgeRequirement] = useState({
    experience_point: "",
    stat: "",
  });
  const [totalBadge, setTotalBadge] = useState("0");
  const [availableBadge, setAvailableBadge] = useState("0");
  const [avatar, setAvatar] = useState();
  const [temporarystat, setTemporarystat] = useState([...stats]);

  const itemsPerPage = 15;
  const [page, setPage] = useState(1);
  const [noOfPages, setNumPages] = useState(
    Math.ceil(badges.length / itemsPerPage)
  );

  const [openAchievementDialog, setOpenAchievementDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

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

  const handleOpenEditDialog = (badge) => {
    setOpenAchievementDialog(true);
    setSelectedBadge(badge);
    setNewBadge({
      ...newBadge,
      title: badge.title,
      badge: badge.badge,
    });
    setRequirementList(badge.achievement_requirements);
    for (var i = temporarystat.length; i--; ) {
      for (var j = badge.achievement_requirements.length; j--; ) {
        if (temporarystat[i].value === badge.achievement_requirements[j].stat) {
          temporarystat.splice(i, 1);
        }
      }
    }
  };

  const handleCloseAchievementDialog = () => {
    setOpenAchievementDialog(false);
    setSelectedBadge();
    handleResetFields();
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleDeleteStat = (index) => {
    for (var i = stats.length; i--; ) {
      if (stats[i].value === requirementList[index].stat) {
        temporarystat.push(stats[i]);
      }
    }
    let arr = [...requirementList];
    arr.splice(index, 1);
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
      for (var i = temporarystat.length; i--; ) {
        if (temporarystat[i].value === newBadgeRequirement.stat) {
          temporarystat.splice(i, 1);
        }
      }
      setNewBadgeRequirement({ experience_point: "", stat: "" });
    }
  };

  const handleResetFields = () => {
    setAvatar();
    setNewBadge({ badge: "", title: "" });
    setRequirementList([]);
    setNewBadgeRequirement({ experience_point: "0", stat: "" });
    setTemporarystat([...stats]);
  };

  const handleDeleteAchievement = (badgeId) => {
    setOpenDeleteDialog(false);
    Service.client
      .delete(`/achievements/${badgeId}`)
      .then((res) => {
        setOpenAchievementDialog(false);
        handleResetFields();
        getBadgesData();
        setSbOpen(true);
        setSnackbar({
          message: "Badge successfully deleted!",
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
        handleResetFields();
      });
  };
  const submitUpdateAchievement = (badge) => {
    console.log(newBadge);
    console.log(newBadgeRequirement);
    console.log(requirementList);
    console.log(avatar && avatar[0].file);
    if (
      selectedBadge.title === newBadge.title &&
      avatar === undefined &&
      requirementList === badge.achievement_requirements
    ) {
      setSbOpen(true);
      setSnackbar({
        message: "There are no updates",
        severity: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
        autoHideDuration: 3000,
      });
      return;
    }
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
    if (
      requirementList.length !== 0 &&
      newBadgeRequirement.stat !== "" &&
      newBadgeRequirement.experience_point !== ""
    ) {
      setSbOpen(true);
      setSnackbar({
        message: "Click on the tick icon to confirm requirement!",
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

    if (avatar !== undefined) {
      formData.append("badge", avatar[0].file);
    }

    // to update badge
    if (requirementList === badge.achievement_requirements) {
      Service.client
        .patch(`/achievements/${badge.id}`, formData)
        .then((res) => {
          setOpenAchievementDialog(false);
          handleResetFields();
          getBadgesData();
          setSbOpen(true);
          setSnackbar({
            message: "Badge successfully updated!",
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
          handleResetFields();
        });
    } else if (requirementList.length !== 0) {
      // to update badge and requirement
      Service.client
        .patch(`/achievements/${badge.id}`, formData)
        .then((res) => {
          requirementList &&
            requirementList.forEach((list, index) => {
              Service.client
                .post(`/achievements/${badge.id}/requirements`, list)
                .then((res) => {
                  if (index === requirementList.length - 1) {
                    setOpenAchievementDialog(false);
                    handleResetFields();
                    getBadgesData();
                    setSbOpen(true);
                    setSnackbar({
                      message: "Badge successfully updated!",
                      severity: "success",
                      anchorOrigin: {
                        vertical: "bottom",
                        horizontal: "center",
                      },
                      autoHideDuration: 3000,
                    });
                  }
                })
                .catch((err) => {
                  console.log(err);
                  setOpenAchievementDialog(false);
                  handleResetFields();
                });
            });
        })
        .catch((err) => {
          console.log(err);
          setOpenAchievementDialog(false);
          handleResetFields();
        });
    } else if (requirementList.length === 0) {
      setSbOpen(true);
      setSnackbar({
        message: "Click on the tick icon to confirm requirement!",
        severity: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
        autoHideDuration: 3000,
      });
      return;
    }
  };

  const submitNewAchievement = () => {
    console.log(newBadge);
    console.log(newBadgeRequirement);

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
    if (
      requirementList.length !== 0 &&
      newBadgeRequirement.stat !== "" &&
      newBadgeRequirement.experience_point !== ""
    ) {
      setSbOpen(true);
      setSnackbar({
        message: "Click on the tick icon to confirm requirement!",
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
    console.log(formData);
    if (requirementList.length !== 0) {
      Service.client
        .post(`/achievements`, formData)
        .then((res) => {
          requirementList &&
            requirementList.forEach((list, index) => {
              Service.client
                .post(`/achievements/${res.data.id}/requirements`, list)
                .then((res) => {
                  if (index === requirementList.length - 1) {
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
                  }
                })
                .catch((err) => {
                  console.log(err);
                  setOpenAchievementDialog(false);
                });
            });
        })
        .catch((err) => {
          console.log(err);
          setOpenAchievementDialog(false);
        });
    } else if (requirementList.length === 0) {
      setSbOpen(true);
      setSnackbar({
        message: "Click on the tick icon to confirm requirement!",
        severity: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
        autoHideDuration: 3000,
      });
      return;
    }
  };

  const getBadgesData = () => {
    Service.client
      .get(`/achievements`, { params: { title: searchValue } })
      .then((res) => {
        res.data
          .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
          .sort((a, b) => a.is_deleted - b.is_deleted);
        setBadges(res.data);
        setNumPages(Math.ceil(res.data.length / itemsPerPage));
      })
      .catch((err) => {
        console.log(err);
      });

    Service.client
      .get(`/achievements`, { params: { title: "" } })
      .then((res) => {
        setTotalBadge(res.data.length);
        let arr = [...res.data.filter((item) => !item.is_deleted)];
        setAvailableBadge(arr.length);
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
    if (searchValue === "") {
      getBadgesData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  return (
    <div style={{ height: "730px" }}>
      <Toast open={sbOpen} setOpen={setSbOpen} {...snackbar} />
      <Grid container>
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
            height: "600px",
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
                .map((badge, index) => (
                  <Tooltip
                    key={index}
                    classes={{ tooltip: classes.tooltip, arrow: classes.arrow }}
                    title={
                      <Card elevation={0} className={classes.description}>
                        <Typography
                          variant="h6"
                          style={{
                            textAlign: "center",
                            fontWeight: 700,
                            marginBottom: badge.is_deleted ? "0px" : "5px",
                            color: "#FFFFFF",
                          }}
                        >
                          {badge.title}
                        </Typography>
                        {badge && badge.is_deleted ? (
                          <Typography
                            variant="body2"
                            style={{
                              color: "#FF4D00",
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
                        <Divider
                          style={{
                            backgroundColor: "#FFFFFF",
                            marginTop: "10px",
                          }}
                        />

                        <Typography
                          variant="body1"
                          style={{
                            fontWeight: 700,
                            margin: "10px 0px 10px 0px",
                          }}
                        >
                          Requirements
                        </Typography>

                        {badge &&
                          badge.achievement_requirements.map(
                            (requirement, index) => (
                              <div
                                key={index}
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Typography variant="body2">
                                  Stats: {requirement.stat}
                                </Typography>
                                <Typography variant="body2">
                                  Points: {requirement.experience_point}
                                </Typography>
                              </div>
                            )
                          )}
                      </Card>
                    }
                  >
                    <CardMedia
                      disabled={badge.is_deleted}
                      onClick={
                        !badge.is_deleted
                          ? () => handleOpenEditDialog(badge)
                          : undefined
                      }
                      className={classes.cardmedia}
                      image={badge.badge}
                      style={{
                        WebkitFilter: badge.is_deleted
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
              Active <br />
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
              {availableBadge}
            </Typography>
            <Typography variant="h4" className={classes.cardnumber}>
              Total no. of <br />
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
              {totalBadge}
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
        transitionDuration={{ exit: "0" }}
        onClose={handleCloseAchievementDialog}
        aria-labelledby="form-dialog-title"
        maxWidth="sm"
        fullWidth={true}
      >
        <DialogTitle id="form-dialog-title">
          {selectedBadge !== undefined ? "Edit Badge" : "Create a New Badge"}
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={handleCloseAchievementDialog}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
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
                  ) : selectedBadge !== undefined ? (
                    <Avatar
                      className={classes.avatar}
                      src={selectedBadge.badge}
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
                  fontWeight: 700,
                  marginBottom: "5px",
                }}
              >
                Requirements
              </Typography>
              <Typography
                variant="body2"
                style={{
                  color: "#000000",

                  marginBottom: "20px",
                }}
              >
                Click on the{" "}
                {<Done color="secondary" style={{ fontSize: "12px" }} />} icon
                to confirm requirement.
              </Typography>
            </Grid>
          </Grid>
          {requirementList &&
            requirementList.map((option, index) => {
              return (
                <Grid container key={index}>
                  <Grid item xs={6}>
                    <label htmlFor="stat">
                      <Typography variant="body2">Statistics</Typography>
                    </label>
                    <TextField
                      id={index}
                      fullWidth
                      disabled
                      variant="outlined"
                      margin="dense"
                      value={option && option.stat}
                    >
                      {temporarystat.map((options, index) => (
                        <MenuItem
                          style={{ height: "35px", fontSize: "14px" }}
                          key={index}
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
                  {temporarystat.map((option) => (
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
                    newBadgeRequirement && newBadgeRequirement.experience_point
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
              <Done color="secondary" />
            </IconButton>
          </Grid>
        </DialogContent>
        <DialogActions>
          {selectedBadge === undefined ? (
            <Button
              style={{ margin: "10px 15px" }}
              variant="contained"
              onClick={() => submitNewAchievement()}
              color="secondary"
            >
              Create
            </Button>
          ) : (
            <div>
              <Button
                style={{
                  margin: "10px 15px",
                  borderColor: "#E12424",
                  color: "#E12424",
                }}
                variant="outlined"
                onClick={() => setOpenDeleteDialog(true)}
              >
                Delete
              </Button>
              <Button
                style={{ margin: "10px 15px" }}
                variant="contained"
                onClick={() => submitUpdateAchievement(selectedBadge)}
                color="secondary"
              >
                Update
              </Button>
            </div>
          )}
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        maxWidth="xs"
        fullWidth={true}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>This action cannot be undone.</DialogContent>
        <DialogActions style={{ margin: 8 }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => setOpenDeleteDialog(false)}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={(e) => handleDeleteAchievement(selectedBadge.id)}
          >
            Confirm
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
            color="secondary"
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
