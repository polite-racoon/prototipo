import { useContext } from 'react';
import Link from 'next/link';
import {
  Paper,
  Grid,
  Typography,
  Divider,
  Box,
  CardActions,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import CloseIcon from '@mui/icons-material/Close';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import firebase from '../../firebase/client';
import { useAuth } from '../../context/auth';
import { UIContext } from '../../context/ui';
import { FavoritesContext } from '../../context/favorites';

const pages = {
  ahorro: 'ahorro',
  inversión: 'inversion',
  vivienda: 'vivienda',
  previsión: 'prevision',
};

const db = firebase.firestore();

export const TipInFavorites = ({ tip }) => {
  const { title, description, category, id, date } = tip;
  const { showCopyToast } = useContext(UIContext);
  const { user } = useAuth();
  const { favorites } = useContext(FavoritesContext);

  const share = () => {
    const { href } = new URL(location.href);
    if (navigator.share) {
      navigator.share({ url: href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showCopyToast(true);
    }
  };

  const deleteFromFavorites = (id) => {
    const newFavorites = favorites.filter((e) => e !== id);
    db.collection('favoritesByUser')
      .doc(user.uid)
      .set({ favorites: newFavorites }, { merge: true });
  };

  return (
    <Grid item xs={12}>
      <Paper sx={{ padding: '0.5rem 1rem' }}>
        <Box display={'flex'} justifyContent={'end'}>
          <IconButton
            size="small"
            edge="end"
            onClick={() => deleteFromFavorites(tip.id)}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <Grid container spacing={0}>
          <Grid
            item
            xs={12}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'left',
            }}
          >
            <Accordion style={{ boxShadow: 'none' }}>
              <AccordionSummary
                expandIcon={<ArrowDropDownIcon />}
                aria-controls="panel2-content"
                id="panel2-header"
              >
                <Typography sx={{ fontWeight: 'bold' }}>{title}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography textAlign={'justify'}>{description}</Typography>
              </AccordionDetails>
              <AccordionSummary></AccordionSummary>
            </Accordion>
            {/* <Typography sx={{ fontWeight: 'bold' }}>{title}</Typography>
            <Divider />
            <Box sx={{ paddingY: '0.5rem' }}>
              <Typography textAlign={'justify'}>{description}</Typography>
            </Box> */}
            <Divider />

            {/* <Typography sx={{ fontSize: '0.8rem' }} color="text.secondary">
              categoría: {category}
            </Typography> */}
            <Box display={'flex'} justifyContent={'space-between'}>
              <CardActions disableSpacing>
                {/* <IconButton aria-label="add to favorites">
                  <FavoriteIcon />
                </IconButton> */}
                <IconButton aria-label="share" onClick={share}>
                  <ShareIcon />
                </IconButton>
              </CardActions>
              <CardActions>
                <Link href={`/${pages[category]}`}>
                  <Typography
                    sx={{ fontSize: '0.8rem' }}
                    color="text.secondary"
                  >
                    Ver mas tips de {category}
                  </Typography>
                </Link>
              </CardActions>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
};
