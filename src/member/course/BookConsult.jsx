import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useParams, useHistory } from "react-router-dom";
import Cookies from "js-cookie";
import Service from "../../AxiosService";

const styles = makeStyles((theme) => ({}));

const BookConsult = () => {
  const classes = styles();
  const history = useHistory();
  const { id } = useParams();
  console.log(id);
};

export default BookConsult;
