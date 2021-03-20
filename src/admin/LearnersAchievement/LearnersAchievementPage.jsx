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
  DialogContentText,
  IconButton,
  Button,
  TextField,
  Avatar,
  MenuItem,
  Chip,
  Tooltip,
} from "@material-ui/core";
import SearchBar from "material-ui-search-bar";
import { DropzoneAreaBase } from "material-ui-dropzone";
import { Add, Close } from "@material-ui/icons";
import Toast from "../../components/Toast.js";
import Service from "../../AxiosService";
import Label from "../../member/landing/components/Label";

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
    height: "120px",
    width: "120px",
    borderRadius: "50%",
    margin: "28px",
  },
  description: {
    borderRadius: 0,
    backgroundColor: "none",
    padding: "15px 10px",
  },
}));

const categories = [
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
];

const languages = [
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
  const [category, setCategory] = useState([]);
  const [codingLanguages, setCodingLanguages] = useState([]);
  const [newBadgeRequirement, setNewBadgeRequirement] = useState({
    experience_point: "0",
    stat: [],
  });
  const [avatar, setAvatar] = useState();

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

  const handleResetFields = () => {
    setAvatar();
    setNewBadge({ badge: "", title: "" });
    setCategory([]);
    setCodingLanguages([]);
    setNewBadgeRequirement({ experience_point: "0", stat: [] });
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
    }
    if (newBadgeRequirement.stat.length === 0) {
      setSbOpen(true);
      setSnackbar({
        message: "State language and/or category requirements",
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
  };

  const getBadgesData = () => {
    Service.client
      .get(`/achievements`, { params: { title: searchValue } })
      .then((res) => {
        res.data.sort((a, b) => a.is_deleted - b.is_deleted);
        setBadges(res.data);
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
        <Grid item xs={8}>
          <div
            style={{
              display: "flex",
              marginRight: "10px",
            }}
          >
            {badges && badges.length > 0 ? (
              badges.map((badge) => (
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
                        {/* {badge &&
                          badge.achievement_requirements[0].experience_point} */}
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
              <Grid item xs={8}>
                <div style={{ marginBottom: "20px" }}>
                  <label htmlFor="title">
                    <Typography variant="body2">Badge Title</Typography>
                  </label>
                  <TextField
                    id="title"
                    style={{
                      width: "90%",
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
                <div style={{ marginBottom: "20px" }}>
                  <label htmlFor="points">
                    <Typography variant="body2">Experience Points</Typography>
                  </label>
                  <TextField
                    id="points"
                    style={{
                      width: "90%",
                    }}
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
                <div style={{ marginBottom: "20px" }}>
                  <label htmlFor="categories">
                    <Typography variant="body2">Categories</Typography>
                  </label>
                  <TextField
                    id="categories"
                    style={{
                      width: "90%",
                    }}
                    variant="outlined"
                    margin="dense"
                    select
                    SelectProps={{
                      multiple: true,
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
                      renderValue: (selected) => (
                        <div className={classes.chips}>
                          {selected.map((value) => (
                            <Chip
                              key={value}
                              label={value}
                              className={classes.chip}
                            />
                          ))}
                        </div>
                      ),
                    }}
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                      setNewBadgeRequirement({
                        ...newBadgeRequirement,
                        stat: codingLanguages.concat(e.target.value),
                      });
                    }}
                  >
                    {categories.map((option) => (
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
                <div style={{ marginBottom: "20px" }}>
                  <label htmlFor="languages">
                    <Typography variant="body2">Coding Languages</Typography>
                  </label>
                  <TextField
                    id="languages"
                    style={{
                      width: "90%",
                    }}
                    variant="outlined"
                    margin="dense"
                    select
                    SelectProps={{
                      multiple: true,
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
                      renderValue: (selected) => (
                        <div className={classes.chips}>
                          {selected.map((value) => (
                            <Chip
                              key={value}
                              label={value}
                              className={classes.chip}
                            />
                          ))}
                        </div>
                      ),
                    }}
                    value={codingLanguages}
                    onChange={(e) => {
                      setCodingLanguages(e.target.value);
                      setNewBadgeRequirement({
                        ...newBadgeRequirement,
                        stat: category.concat(e.target.value),
                      });
                    }}
                  >
                    {languages.map((option) => (
                      <MenuItem
                        style={{ height: "35px", fontSize: "14px" }}
                        key={option.label}
                        value={option.value}
                      >
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>
              </Grid>
              <Grid item xs={4}>
                <div
                  style={{
                    display: "flex",
                    marginTop: "20px",
                    justifyContent: "center",
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
            </Grid>
            <br />
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
                badge: avatar && avatar[0].data,
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
