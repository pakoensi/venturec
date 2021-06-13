import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { API, graphqlOperation, Storage, label } from "aws-amplify";
import { AmplifyAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";
import { createProduct } from "../graphql/mutations";
import config from "../aws-exports";
import Controls from "../components/controls/Controls";
import {
  Container,
  InputLabel,
  Button,
  CssBaseline,
  Box,
  TextField,
  Checkbox,
  Grid,
  Select,
  MenuItem,
  FormControl,
  Paper,
} from "@material-ui/core";
import {
  makeStyles,
  createStyles,
  createMuiTheme,
} from "@material-ui/core/styles";

import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
//import Controls from "./../components/controls/Controls";

//added
const initialFValues = {
  id: 0,
  fullName: "",
  email: "",
  mobile: "",
  city: "",
  gender: "male",
  departmentId: "",
  hireDate: new Date(),
  isPermanent: false,
};
const options = () => [
  { id: 1, title: "Phones" },
  { id: 2, title: "Camera" },
  { id: 3, title: "Laptops" },
  { id: 4, title: "Phone" },
  { id: 5, title: "Phones" },
];

const {
  aws_user_files_s3_bucket_region: region,
  aws_user_files_s3_bucket: bucket,
} = config;

//added styles
const theme = createMuiTheme({
  spacing: 5,
});

const useStyles = makeStyles({
  root: {
    "& .MuiFormControl-root": {
      width: "80%",
      margin: theme.spacing(2),
    },
    box: {
      height: "80%",
    },
  },
  formImage: {
    boxShadow: "0 0 10px",
    backgroundColor: "white",
    width: "800px",
    height: "800px",
    display: "flex",
    flexWrap: "wrap",
    // border-radius:'15px 15px 15px 15px',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: "25ch",
  },
  divForm: {
    width: "90%",
  },
  image: {
    width: "90%",
    height: "40%",
    margin: "8px",
  },
  paperRoot: {
    maxWidth: 345,
  },
  pageContent: {
    margin: theme.spacing(5),
    padding: theme.spacing(3),
  },
  searchInput: {
    width: "75%",
  },
  newButton: {
    position: "absolute",
    right: "10px",
  },
});

const Admin = () => {
  const classes = useStyles();
  const [cate, setCate] = useState();
  const [image, setImage] = useState(null);
  const [productDetails, setProductDetails] = useState({
    title: "",
    description: "",
    image: "",
    author: "",
    price: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!productDetails.title || !productDetails.price) return;
      await API.graphql(
        graphqlOperation(createProduct, { input: productDetails })
      );
      setProductDetails({
        title: "",
        description: "",
        image: "",
        author: "",
        price: "",
      });
    } catch (err) {
      console.log("error creating todo:", err);
    }
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    const extension = file.name.split(".")[1];
    const name = file.name.split(".")[0];
    const key = `images/${uuidv4()}${name}.${extension}`;
    const url = `https://${bucket}.s3.${region}.amazonaws.com/public/${key}`;
    try {
      // Upload the file to s3 with public access level.
      await Storage.put(key, file, {
        level: "public",
        contentType: file.type,
      });
      // Retrieve the uploaded file to display
      const image = await Storage.get(key, { level: "public" });
      setImage(image);
      setProductDetails({ ...productDetails, image: url });
    } catch (err) {
      console.log(err);
    }
  };

  //Added styles
  const option = options();
  return (
    <AmplifyAuthenticator>
      <header className="form-header">
        <h3>Add New Product</h3>
        <AmplifySignOut></AmplifySignOut>
      </header>

      {/* <Box className={classes.formImage}> */}
      <Paper className={classes.pageContent}>
        <form className="root" onSubmit={handleSubmit}>
          <input
            type="file"
            accept="image/jpg"
            onChange={(e) => handleImageUpload(e)}
          />
          {/* <div className="form-image">
                  {image ? (
                    <img className="image-preview" src={image} alt="" />
                  ) : (
                    <input
                      type="file"
                      accept="image/jpg"
                      onChange={(e) => handleImageUpload(e)}
                    />
                  )}
                </div> */}
          <Grid container>
            <Grid item xs={6}>
              <div>
                <Controls.Input
                  label="mobile"
                  // name="mobile"
                  value={null}
                  onChange={null}
                />
              </div>
              <Controls.Input
                variant="outlined"
                id="outlined-full-width"
                label="Name"
                // style={{ margin: 8 }}
                // name="email"
                //type="title"
                placeholder="Type the title"
                onChange={(e) =>
                  setProductDetails({
                    ...productDetails,
                    title: e.target.value,
                  })
                }
                required
              />

              <Controls.Input
                variant="outlined"
                id="outlined-full-width"
                label="description"
                style={{ margin: 8 }}
                name="description"
                type="text"
                rows="8"
                placeholder="Type the description of the book"
                onChange={(e) =>
                  setProductDetails({
                    ...productDetails,
                    description: e.target.value,
                  })
                }
                required
              />
            </Grid>
            <Grid item xs={6}>
              <div>
                <Controls.Input
                  variant="outlined"
                  id="outlined-full-width"
                  label="Author"
                  style={{ margin: 8 }}
                  name="author"
                  margin="normal"
                  // type="text"
                  placeholder="Type the author's name"
                  onChange={(e) =>
                    setProductDetails({
                      ...productDetails,
                      author: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <FormControl variant="outlined">
                  <InputLabel>Category</InputLabel>
                  <Select
                    label="Category"
                    name="Category"
                    value={cate}
                    onChange={(e) => setCate(e)}
                  >
                    <MenuItem value="">None</MenuItem>
                    {option.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.title}
                      </MenuItem>
                    ))}
                  </Select>
                  {/* {error && <FormHelperText>{error}</FormHelperText>} */}
                </FormControl>
              </div>

              <div className="price-form">
                <TextField
                  variant="outlined"
                  id="outlined-full-width"
                  label="Price"
                  style={{ margin: 8 }}
                  name="price"
                  type="text"
                  placeholder="What is the Price of the product (Gh)"
                  onChange={(e) =>
                    setProductDetails({
                      ...productDetails,
                      price: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="featured-form">
                <p>
                  <label>Featured?</label>
                  <Checkbox
                    type="checkbox"
                    className="featured-checkbox"
                    checked={productDetails.featured}
                    onChange={() =>
                      setProductDetails({
                        ...productDetails,
                        featured: !productDetails.featured,
                      })
                    }
                  />
                </p>
              </div>
            </Grid>
            <div>
              {image && (
                <Card className={classes.paperRoot}>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      alt="Contemplative Reptile"
                      height="140"
                      image={image}
                      title="Contemplative Reptile"
                    />
                  </CardActionArea>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                      {productDetails.author}
                    </Typography>
                  </CardContent>
                </Card>
              )}
            </div>
          </Grid>
          <div>
            <Button className="btn" type="submit">
              Submit
            </Button>
          </div>
        </form>
      </Paper>
    </AmplifyAuthenticator>
  );
};

export default Admin;
