import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Card,
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
} from "@material-ui/core";
import SearchBar from "material-ui-search-bar";
import { DropzoneAreaBase } from "material-ui-dropzone";
import { Add, Close } from "@material-ui/icons";
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
    margin: "4px 0px 5px 10px",
    backgroundColor: "#164D8F",
    color: "#FFFFFF",
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

const AdminLearnersAchievementPage = () => {
  const classes = useStyles();

  const [badges, setBadges] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [newBadge, setNewBadge] = useState({
    badge: "",
    title: "",
  });
  const [newBadgeRequirement, setNewBadgeRequirement] = useState({
    experience_point: "0",
    category: [],
    coding_languages: [],
  });
  const [avatar, setAvatar] = useState();

  const [openAchievementDialog, setOpenAchievementDialog] = useState(false);
  const [openBadgePicDialog, setOpenBadgePicDialog] = useState(false);

  const handleOpenAchievementDialog = (e) => {
    setOpenAchievementDialog(true);
  };

  const handleCloseAchievementDialog = () => {
    setOpenAchievementDialog(false);
  };

  const submitNewAchievement = () => {
    console.log(newBadge);
    console.log(newBadgeRequirement);
  };

  const getBadgesData = () => {
    Service.client
      .get(`/achievements`, { params: { title: searchValue } })
      .then((res) => {
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
    <div>
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
          ></div>
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
                    value={newBadgeRequirement && newBadgeRequirement.category}
                    onChange={(e) => {
                      setNewBadgeRequirement({
                        ...newBadgeRequirement,
                        category: e.target.value,
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
              </Grid>
              <Grid item xs={4}>
                <div
                  style={{
                    marginBottom: "10px",
                    display: "flex",
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
                        Upload badge Logo
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
          <Button onClick={() => submitNewAchievement()} color="secondary">
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
