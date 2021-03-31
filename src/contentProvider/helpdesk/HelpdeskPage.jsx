import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import PageTitle from "../../components/PageTitle.js";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Typography,
} from "@material-ui/core";
import { ExpandMore } from "@material-ui/icons";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  contactUs: {
    backgroundColor: theme.palette.red.main,
    color: "#fff",
    "&:hover": {
      backgroundColor: theme.palette.darkred.main,
    },
  },
}));

const FAQ = [
  {
    question: "How Do I Edit My Email Address?",
    answer:
      "To edit your email address, select your avatar icon at the top of the page and click on 'Manage Your Profile' from the dropdown menu to edit your email address.",
  },
  {
    question: "How Do I Change My Password?",
    answer:
      "To change your password, select your avatar icon at the top of the page and click on 'Manage Your Profile' from the dropdown menu to access your profile. At that page, click on 'Change Password' to change your password.",
  },
  {
    question: "Where Can I See My Earnings For The Month?",
    answer: `To see your earnings, click on 'Earnings' on the sidebar.`,
  },
  {
    question:
      "A Student Is Displaying Inappropriate Behaviour/Comments In My Course. What Can I Do?",
    answer: `Please contact us directly so that we can carry out further investigation if necessary. All individuals are expected to abide by Codeine's terms and can be removed from a course or have their account terminated if they violate these terms.`,
  },
  {
    question:
      "Can My University or Organisation Offer Courses/Seminars On Codeine?",
    answer: `Yes, it is possible. Codeine is always looking forward to work with different types of organisations around the world to provide education courses or seminars for our members here. Do register with us on a sperate account as an organisation.`,
  },
  {
    question: "What Is The Difference Between Free-Tier And Pro-Tier Members?",
    answer: `Pro-Tier members have to pay a monthly subscription fee to have access to Codeine's integrated coding environment and unlimited access to course consultations. Courses that you have created can also be set to be limited to only for Pro-Tier members. The earnings from the subscriptions forms a part of your monthly earnings.`,
  },
];

const HelpdeskPage = () => {
  const classes = useStyles();

  const [expanded, setExpanded] = useState(false);
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <PageTitle title="Helpdesk" />
        <Button variant="outlined" color="primary">
          View Submitted Issues
        </Button>
      </div>
      <Typography
        variant="h4"
        style={{
          textAlign: "center",
          paddingTop: "20px",
          paddingBottom: "20px",
          color: "#437FC7",
        }}
      >
        Common FAQs
      </Typography>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "70%",
          margin: "auto",
        }}
      >
        {FAQ &&
          FAQ.length > 0 &&
          FAQ.map((faq, index) => {
            return (
              <Accordion
                expanded={expanded === `${index}`}
                onChange={handleChange(`${index}`)}
                key={`${index}`}
              >
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  id={`${index}`}
                  style={{ backgroundColor: "#F4F4F4" }}
                >
                  <Typography variant="h6" style={{ fontWeight: 600 }}>
                    {faq.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1">{faq.answer}</Typography>
                </AccordionDetails>
              </Accordion>
            );
          })}
      </div>
      <Typography
        variant="h4"
        style={{
          textAlign: "center",
          paddingTop: "50px",
          paddingBottom: "20px",
        }}
      >
        Can't find what you're looking for?
      </Typography>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        <Button
          variant="contained"
          className={classes.contactUs}
          component={Link}
          to="/partner/home/helpdesk/contact-us"
        >
          Contact Us
        </Button>
      </div>
    </div>
  );
};

export default HelpdeskPage;
