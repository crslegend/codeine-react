import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  CardMedia,
  CardContent,
  IconButton,
  Typography,
  Avatar,
} from "@material-ui/core";
import { Link, useHistory, useParams } from "react-router-dom";
import Label from "../../member/industryProject/components/Label";
import Service from "../../AxiosService";
import { ArrowBack } from "@material-ui/icons";

const styles = makeStyles((theme) => ({
  root: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    fontDisplay: "swap",
  },
  mainSection: {
    minHeight: "calc(100vh - 10px)",
    paddingLeft: theme.spacing(0),
    paddingRight: theme.spacing(0),
  },
  courseSection: {
    display: "flex",
    marginTop: "15px",
  },
  cardmedia: {
    height: "100%",
    width: "7vw",
  },
  orgavatar: {
    objectFit: "contain",
  },
}));

const ViewIndustryProjectDetails = () => {
  const classes = styles();
  const history = useHistory();
  const { id } = useParams();
  const [industryProject, setIndustryProject] = useState();

  const formatDate = (date) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    if (date !== null) {
      const newDate = new Date(date).toLocaleDateString(undefined, options);
      return newDate;
    }
    return "";
  };

  const [categories, setCategories] = useState({
    SEC: false,
    DB: false,
    FE: false,
    BE: false,
    UI: false,
    ML: false,
  });

  const getlndustryProject = () => {
    Service.client
      .get(`/industry-projects/${id}`)
      .then((res) => {
        // console.log(res);
        setIndustryProject(res.data);
        let newCategories = { ...categories };
        for (let i = 0; i < res.data.categories.length; i++) {
          newCategories = {
            ...newCategories,
            [res.data.categories[i]]: true,
          };
        }
        setCategories(newCategories);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getlndustryProject();
  }, []);

  return (
    <div className={classes.root}>
      <div className={classes.mainSection}>
        <div style={{ marginTop: "20px" }}>
          <IconButton onClick={() => history.push("/admin/industryproject")}>
            <ArrowBack />
          </IconButton>
        </div>
        {industryProject ? (
          <div>
            <div className={classes.titleSection}>
              <Grid container justify="space-between">
                <Grid style={{ backgroundColor: "#FAFAFA" }} item xs={1}>
                  <Avatar
                    variant="square"
                    className={classes.cardmedia}
                    src={
                      industryProject.partner.partner.organization
                        .organization_photo
                    }
                    title="Organisation Photo"
                    classes={{
                      img: classes.orgavatar,
                    }}
                  ></Avatar>
                </Grid>
                <Grid style={{ backgroundColor: "#FAFAFA" }} item xs={11}>
                  <CardContent>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography
                        style={{
                          fontWeight: 600,
                        }}
                        variant="h5"
                      >
                        {industryProject && industryProject.title}
                      </Typography>
                    </div>
                    <Typography variant="h6">
                      {industryProject &&
                        industryProject.partner.partner.organization
                          .organization_name}
                    </Typography>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: "5px",
                      }}
                    ></div>
                  </CardContent>
                </Grid>
                <div
                  style={{
                    width: "61%",
                    backgroundColor: "#FAFAFA",
                    marginTop: 20,
                  }}
                >
                  <CardContent>
                    <Typography style={{ fontWeight: 600 }}>
                      Categories
                    </Typography>
                    <div style={{ display: "flex", marginTop: 5 }}>
                      {industryProject &&
                        industryProject.categories.map((category) => (
                          <Label label={category} />
                        ))}
                      {console.log(industryProject)}
                    </div>
                    <Typography
                      style={{
                        marginTop: 15,
                        marginBottom: 5,
                        fontWeight: 600,
                      }}
                    >
                      Description
                    </Typography>
                    {industryProject && industryProject.description}
                  </CardContent>
                </div>
                <div
                  style={{
                    width: "36%",
                    backgroundColor: "#FAFAFA",
                    marginTop: 20,
                  }}
                >
                  <CardContent>
                    <Typography style={{ fontWeight: 600 }}>
                      Date Listed:
                    </Typography>
                    {industryProject && formatDate(industryProject.date_listed)}
                    <Typography style={{ fontWeight: 600, marginTop: 15 }}>
                      Start Date:
                    </Typography>
                    {industryProject && formatDate(industryProject.start_date)}
                    <Typography style={{ fontWeight: 600, marginTop: 15 }}>
                      End Date:
                    </Typography>
                    {industryProject && formatDate(industryProject.end_date)}
                    <Typography style={{ fontWeight: 600, marginTop: 15 }}>
                      Application Deadline:
                    </Typography>
                    {industryProject &&
                      formatDate(industryProject.application_deadline)}
                  </CardContent>
                </div>
              </Grid>
            </div>
          </div>
        ) : (
          <div>Loading....</div>
        )}
      </div>
    </div>
  );
};

export default ViewIndustryProjectDetails;
