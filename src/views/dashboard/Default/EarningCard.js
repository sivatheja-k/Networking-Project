import PropTypes from "prop-types";
import { useState } from "react";

// material-ui
import { styled, useTheme } from "@mui/material/styles";
import { Avatar, Box, Grid, Menu, MenuItem, Typography } from "@mui/material";

// project imports
import MainCard from "../../../ui-component/cards/MainCard";
import SkeletonEarningCard from "../../../ui-component/cards/Skeleton/EarningCard";

// assets
import EarningIcon from "../../../assets/images/icons/earning.svg";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import GetAppTwoToneIcon from "@mui/icons-material/GetAppOutlined";
import FileCopyTwoToneIcon from "@mui/icons-material/FileCopyOutlined";
import PictureAsPdfTwoToneIcon from "@mui/icons-material/PictureAsPdfOutlined";
import ArchiveTwoToneIcon from "@mui/icons-material/ArchiveOutlined";

const CardWrapper = styled(MainCard)(({ theme, fillcolor }) => ({
  backgroundColor: theme.palette[fillcolor].dark,
  color: "#fff",
  overflow: "hidden",
  position: "relative",
  // "&:after": {
  //   content: '""',
  //   position: "absolute",
  //   width: 210,
  //   height: 210,
  //   background: theme.palette[fillcolor][800],
  //   borderRadius: "50%",
  //   top: -85,
  //   right: -95,
  //   [theme.breakpoints.down("sm")]: {
  //     top: -105,
  //     right: -140,
  //   },
  // },
  // "&:before": {
  //   content: '""',
  //   position: "absolute",
  //   width: 210,
  //   height: 210,
  //   background: theme.palette[fillcolor][800],
  //   borderRadius: "50%",
  //   top: -125,
  //   right: -15,
  //   opacity: 0.5,
  //   [theme.breakpoints.down("sm")]: {
  //     top: -155,
  //     right: -70,
  //   },
  // },
}));

// ===========================|| DASHBOARD DEFAULT - EARNING CARD ||=========================== //

const EarningCard = ({ isLoading, icon, fillcolor, title, total }) => {
  const theme = useTheme();

  return (
    <>
      {isLoading ? (
        <SkeletonEarningCard />
      ) : (
        <CardWrapper border={false} content={false} fillcolor={fillcolor}>
          <Box sx={{ p: 2.25 }}>
            <Grid
              container
              sx={{
                placeItems: "center",
              }}
            >
              <Grid xs={6} item>
                <Grid item>
                  <Grid container alignItems="center">
                    <Grid item>
                      <Typography
                        sx={{
                          fontSize: "3rem",
                          fontWeight: 500,
                          mr: 1,
                          mt: 1.75,
                          mb: 0.75,
                        }}
                      >
                        {total}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item sx={{ mb: 1.25 }}>
                  <Typography
                    sx={{
                      fontSize: "1rem",
                      fontWeight: 500,
                      color: theme.palette[fillcolor][200],
                    }}
                  >
                    Total {title}
                  </Typography>
                </Grid>
              </Grid>
              <Grid xs={6} item>
                <img
                  src={icon}
                  alt="Notification"
                  width="90%"
                  height="90%"
                  style={{
                    zIndex: 99,
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        </CardWrapper>
      )}
    </>
  );
};

EarningCard.propTypes = {
  isLoading: PropTypes.bool,
};

export default EarningCard;
